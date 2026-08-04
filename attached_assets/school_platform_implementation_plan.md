# School Platform — Multi-Tenant Content Architecture
## Implementation Plan (School-Agnostic Design)

> **Goal:** Every school that joins the platform (`/school/{slug}`) gets the same
> intelligent page templates that auto-resolve to that school's own data.
> No hardcoded school content anywhere in JSON files or seeders.

---

## Guiding Principle

```
Route /school/{slug}/api/content/{page}
         │
         ▼
CompositionService loads ONE shared template (e.g. "home")
         │
         ▼
SchoolEntityResolver fetches the school record by slug
         │
         ▼
Template variables ({{school.name}}, {{school.programs}}, …)
are resolved against that school's DB record
         │
         ▼
Composed page returned — correct for that specific school
```

One template file = all schools. School-specific data = database rows.

---

## Phase 1 — Diagnose the Current 404s

### 1.1  Find why CompositionService returns `not_found`

On the server, temporarily add logging to `CompositionService::resolvePage()`:

```php
// In CompositionService.php, inside resolvePage() before the return not_found:
\Log::debug('CompositionService::resolvePage', [
    'slug'        => $slug,
    'school_slug' => $schoolSlug ?? 'none',
    'page_found'  => $page !== null,
    'sections'    => $page?->sections ?? [],
    'visibility'  => $this->visibilityService->check($page, $schoolSlug),
]);
```

Then hit:
```
GET /school/shafeea/api/content/home
GET /school/shafeea/api/content/newsroom/stories
```

And check:
```bash
tail -f storage/logs/laravel-$(date +%Y-%m-%d).log | grep CompositionService
```

This tells you whether:
- (A) The page row doesn't exist in the DB at all
- (B) The page exists but VisibilityService excludes it
- (C) The page exists and is visible but section composition fails

The fix in Phase 2 addresses all three, but knowing which one is failing first
helps you verify the fix is hitting the right layer.

---

## Phase 2 — Add the Schools Table (if it doesn't exist)

Check first:
```bash
php artisan tinker --execute="Schema::hasTable('schools') ? 'yes' : 'no';"
```

### 2.1  Migration: `create_schools_table`

```bash
php artisan make:migration create_schools_table
```

```php
// database/migrations/xxxx_xx_xx_create_schools_table.php
public function up(): void
{
    Schema::create('schools', function (Blueprint $table) {
        $table->id();
        $table->string('slug')->unique();          // "shafeea", "riyadh-academy"
        $table->string('name');                    // "Shafeea International School"
        $table->string('name_ar')->nullable();     // Arabic name
        $table->string('tagline')->nullable();
        $table->string('tagline_ar')->nullable();
        $table->string('logo_url')->nullable();
        $table->string('favicon_url')->nullable();
        $table->string('primary_color', 7)->default('#1a56db');
        $table->string('locale_default', 5)->default('en');
        $table->json('locales_supported')->default('["en","ar"]');
        $table->json('contact')->nullable();       // {email, phone, address}
        $table->json('social')->nullable();        // {twitter, linkedin, ...}
        $table->boolean('active')->default(true);
        $table->timestamps();
    });

    Schema::create('school_programs', function (Blueprint $table) {
        $table->id();
        $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
        $table->string('slug');
        $table->string('name');
        $table->string('name_ar')->nullable();
        $table->text('description')->nullable();
        $table->text('description_ar')->nullable();
        $table->string('icon')->nullable();
        $table->integer('sort_order')->default(0);
        $table->timestamps();
    });

    Schema::create('school_media', function (Blueprint $table) {
        $table->id();
        $table->foreignId('school_id')->constrained('schools')->cascadeOnDelete();
        $table->string('key');    // "hero_image", "og_image", "promo_video"
        $table->string('url');
        $table->string('alt')->nullable();
        $table->timestamps();
        $table->unique(['school_id', 'key']);
    });
}
```

```bash
php artisan migrate
```

### 2.2  Model: `School`

```php
// app/Models/School.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class School extends Model
{
    protected $fillable = [
        'slug', 'name', 'name_ar', 'tagline', 'tagline_ar',
        'logo_url', 'favicon_url', 'primary_color',
        'locale_default', 'locales_supported',
        'contact', 'social', 'active',
    ];

    protected $casts = [
        'locales_supported' => 'array',
        'contact'           => 'array',
        'social'            => 'array',
        'active'            => 'boolean',
    ];

    public static function findBySlug(string $slug): ?self
    {
        return static::where('slug', $slug)->where('active', true)->first();
    }

    public function programs(): HasMany
    {
        return $this->hasMany(SchoolProgram::class)->orderBy('sort_order');
    }

    public function media(): HasMany
    {
        return $this->hasMany(SchoolMedia::class);
    }

    public function mediaUrl(string $key): ?string
    {
        return $this->media->firstWhere('key', $key)?->url;
    }

    /** Returns the full resolution context array for template interpolation. */
    public function toTemplateContext(string $locale = 'en'): array
    {
        $nameKey    = $locale === 'ar' ? 'name_ar'    : 'name';
        $taglineKey = $locale === 'ar' ? 'tagline_ar' : 'tagline';

        return [
            'school' => [
                'slug'          => $this->slug,
                'name'          => $this->{$nameKey} ?? $this->name,
                'tagline'       => $this->{$taglineKey} ?? $this->tagline ?? '',
                'logo_url'      => $this->logo_url ?? '',
                'favicon_url'   => $this->favicon_url ?? '',
                'primary_color' => $this->primary_color,
                'hero_image'    => $this->mediaUrl('hero_image') ?? '',
                'og_image'      => $this->mediaUrl('og_image') ?? '',
                'email'         => $this->contact['email'] ?? '',
                'phone'         => $this->contact['phone'] ?? '',
                'address'       => $this->contact['address'] ?? '',
                'programs'      => $this->programs->map(fn($p) => [
                    'slug'        => $p->slug,
                    'name'        => $locale === 'ar' ? ($p->name_ar ?? $p->name) : $p->name,
                    'description' => $locale === 'ar' ? ($p->description_ar ?? $p->description) : $p->description,
                    'icon'        => $p->icon ?? '',
                ])->toArray(),
                'social'        => $this->social ?? [],
            ],
        ];
    }
}
```

---

## Phase 3 — Template Variable Interpolation Service

### 3.1  Create `TemplateResolver`

```php
// app/Services/Content/TemplateResolver.php
namespace App\Services\Content;

class TemplateResolver
{
    /**
     * Recursively walk any array/string structure and replace
     * {{dotted.key}} placeholders with values from $context.
     */
    public function resolve(mixed $template, array $context): mixed
    {
        if (is_string($template)) {
            return $this->interpolate($template, $context);
        }

        if (is_array($template)) {
            foreach ($template as $key => $value) {
                $template[$key] = $this->resolve($value, $context);
            }
        }

        return $template;
    }

    private function interpolate(string $str, array $context): string
    {
        return preg_replace_callback(
            '/\{\{([a-z0-9_.]+)\}\}/i',
            function (array $matches) use ($context) {
                return $this->dot($context, $matches[1]) ?? $matches[0];
            },
            $str
        );
    }

    /** Dot-notation accessor: "school.programs" → $context['school']['programs'] */
    private function dot(array $data, string $key): mixed
    {
        $parts = explode('.', $key);
        $value = $data;
        foreach ($parts as $part) {
            if (!is_array($value) || !array_key_exists($part, $value)) {
                return null;
            }
            $value = $value[$part];
        }
        // If the resolved value is an array, JSON-encode it so it's embeddable
        return is_array($value) ? json_encode($value) : (string) $value;
    }
}
```

### 3.2  Wire TemplateResolver into CompositionService

Find your `CompositionService` (likely `app/Services/Content/CompositionService.php`)
and inject `TemplateResolver` + accept a school context:

```php
// app/Services/Content/CompositionService.php  (relevant diff)

use App\Models\School;
use App\Services\Content\TemplateResolver;

class CompositionService
{
    public function __construct(
        // ... existing dependencies ...
        private TemplateResolver $templateResolver,
    ) {}

    /**
     * Compose a page for a specific school and locale.
     * $schoolSlug comes from the route parameter.
     */
    public function composePage(string $slug, string $schoolSlug, string $locale = 'en'): array|null
    {
        // 1. Load template (school-agnostic)
        $page = $this->resolvePage($slug);

        if (!$page) {
            return null;  // → ContentController returns 404
        }

        // 2. Load school entity
        $school = School::findBySlug($schoolSlug);

        if (!$school) {
            return null;  // Unknown school slug → 404
        }

        // 3. Build resolution context
        $context = array_merge(
            $school->toTemplateContext($locale),
            ['locale' => $locale],
        );

        // 4. Resolve all {{placeholders}} in the composed page data
        $composed = $this->buildComposedPage($page, $locale);
        $resolved = $this->templateResolver->resolve($composed, $context);

        return $resolved;
    }
}
```

### 3.3  Update ContentController

```php
// app/Http/Controllers/School/ContentController.php  (relevant diff)

public function show(Request $request, string $schoolSlug, string $pageSlug): JsonResponse
{
    $locale = $request->header('Accept-Language', 'en');

    $page = $this->compositionService->composePage($pageSlug, $schoolSlug, $locale);

    if (!$page) {
        return response()->json(['error' => 'PAGE_NOT_FOUND'], 404);
    }

    return response()->json($page);
}
```

---

## Phase 4 — Rewrite the Content JSON Templates (School-Agnostic)

Replace every file in `database/content/pages/` with placeholder-based templates.
These files are now **identical for every school** — no school name hardcoded.

### `database/content/pages/home.json`

```json
{
  "slug": "home",
  "contract_type": "page",
  "meta": {
    "title": "{{school.name}}",
    "description": "{{school.tagline}}",
    "og_image": "{{school.og_image}}"
  },
  "sections": [
    {
      "id": "hero",
      "type": "hero_banner",
      "visible": true,
      "data": {
        "heading": "{{school.name}}",
        "subheading": "{{school.tagline}}",
        "logo": "{{school.logo_url}}",
        "hero_image": "{{school.hero_image}}",
        "cta_primary": {
          "label_en": "Explore Programs",
          "label_ar": "استعرض البرامج",
          "href": "/school/{{school.slug}}/programs"
        }
      }
    },
    {
      "id": "programs",
      "type": "programs_grid",
      "visible": true,
      "data": {
        "heading_en": "Our Programs",
        "heading_ar": "برامجنا",
        "items": "{{school.programs}}"
      }
    },
    {
      "id": "contact_form",
      "type": "contact_form",
      "visible": true,
      "data": {
        "email": "{{school.email}}",
        "phone": "{{school.phone}}",
        "address": "{{school.address}}"
      }
    }
  ]
}
```

### `database/content/pages/newsroom.stories.json`

```json
{
  "slug": "newsroom/stories",
  "contract_type": "page",
  "meta": {
    "title_en": "Success Stories — {{school.name}}",
    "title_ar": "قصص النجاح — {{school.name}}"
  },
  "sections": [
    {
      "id": "stories_header",
      "type": "page_header",
      "data": {
        "heading_en": "Success Stories",
        "heading_ar": "قصص النجاح",
        "school_name": "{{school.name}}"
      }
    },
    {
      "id": "stories_list",
      "type": "stories_feed",
      "data": {
        "source": "dynamic",
        "school_slug": "{{school.slug}}"
      }
    }
  ]
}
```

> Apply the same pattern to: `newsroom.news.json`, `newsroom.about.json`,
> `newsroom.overview.json`, `contact.json`, `legal.privacy.json`, `legal.terms.json`.
> Replace every school-specific string with a `{{school.*}}` placeholder.

### `database/content/admin/entity_identities.json`

This file should now just define the **schema** of identity fields — not values.
Actual values live in the `schools` DB table:

```json
{
  "_note": "School identity is stored in the schools table, not here. This file defines the field schema only.",
  "fields": ["slug", "name", "name_ar", "logo_url", "primary_color", "contact", "social"]
}
```

---

## Phase 5 — Seed Shafeea School Data (One School, Schema-Level)

The `ContentSeeder` now seeds **template structure only** (runs once, for all schools).
School-specific data goes into a separate `SchoolSeeder`.

### 5.1  `database/seeders/Schools/SchoolSeeder.php`

```php
<?php

namespace Database\Seeders\Schools;

use App\Models\School;
use App\Models\SchoolProgram;
use Illuminate\Database\Seeder;

class SchoolSeeder extends Seeder
{
    public function run(): void
    {
        $school = School::updateOrCreate(
            ['slug' => 'shafeea'],
            [
                'name'             => 'Shafeea International School',
                'name_ar'          => 'مدرسة شافعة الدولية',
                'tagline'          => 'Empowering Minds, Building Futures',
                'tagline_ar'       => 'تمكين العقول وبناء المستقبل',
                'logo_url'         => '/storage/schools/shafeea/logo.png',
                'primary_color'    => '#1a56db',
                'locale_default'   => 'ar',
                'locales_supported'=> ['en', 'ar'],
                'contact' => [
                    'email'   => 'info@shafeea.edu',
                    'phone'   => '+966-xx-xxx-xxxx',
                    'address' => 'Riyadh, Saudi Arabia',
                ],
                'social' => [
                    'twitter'  => 'https://twitter.com/shafeea',
                    'linkedin' => '',
                ],
                'active' => true,
            ]
        );

        // Seed programs
        $programs = [
            ['slug' => 'primary',     'name' => 'Primary School',      'name_ar' => 'المرحلة الابتدائية',   'icon' => 'book-open',   'sort_order' => 1],
            ['slug' => 'middle',      'name' => 'Middle School',        'name_ar' => 'المرحلة المتوسطة',     'icon' => 'academic-cap','sort_order' => 2],
            ['slug' => 'secondary',   'name' => 'Secondary School',     'name_ar' => 'المرحلة الثانوية',     'icon' => 'graduation',  'sort_order' => 3],
            ['slug' => 'extracurr',   'name' => 'Extracurricular',      'name_ar' => 'الأنشطة اللاصفية',    'icon' => 'star',        'sort_order' => 4],
        ];

        foreach ($programs as $program) {
            SchoolProgram::updateOrCreate(
                ['school_id' => $school->id, 'slug' => $program['slug']],
                $program
            );
        }
    }
}
```

Run on the server:
```bash
php artisan db:seed --class=Database\\Seeders\\Schools\\SchoolSeeder
```

### 5.2  ContentSeeder — templates only

Ensure `ContentSeeder` seeds the JSON template files (with `{{placeholders}}`) into
the DB as-is. It should NOT attempt to resolve any school data — that happens at
request time in `CompositionService`.

```bash
php artisan db:seed --class=Database\\Seeders\\Schools\\ContentSeeder
```

---

## Phase 6 — Register TemplateResolver in Service Container

```php
// app/Providers/AppServiceProvider.php

use App\Services\Content\TemplateResolver;
use App\Services\Content\CompositionService;

public function register(): void
{
    $this->app->singleton(TemplateResolver::class);

    $this->app->singleton(CompositionService::class, function ($app) {
        return new CompositionService(
            // ... existing bindings ...
            $app->make(TemplateResolver::class),
        );
    });
}
```

---

## Phase 7 — Verification

### 7.1  Seed and test

```bash
# On the server
php artisan migrate
php artisan db:seed --class=Database\\Seeders\\Schools\\SchoolSeeder
php artisan db:seed --class=Database\\Seeders\\Schools\\ContentSeeder
php artisan cache:clear
php artisan view:clear
```

### 7.2  Hit the endpoints

```bash
curl -s https://shafeea.systems360.cloud/school/shafeea/api/content/home \
  | python3 -m json.tool | head -40

curl -s https://shafeea.systems360.cloud/school/shafeea/api/content/newsroom/stories \
  | python3 -m json.tool | head -20
```

Expected: HTTP 200, `contract_type: "page"`, school name resolved in `meta.title`.

### 7.3  Validate school-agnosticism with a test school

```bash
php artisan tinker
>>> School::create(['slug'=>'test-school','name'=>'Test School','active'=>true]);
```

Then:
```bash
curl -s https://shafeea.systems360.cloud/school/test-school/api/content/home \
  | python3 -m json.tool | grep -i "test school"
```

Should return the home page with "Test School" in the title — **zero new JSON files written**.

---

## What NOT to do

| ❌ Wrong | ✅ Right |
|---|---|
| Write `pages/home.shafeea.json` per school | One `pages/home.json` with `{{placeholders}}` |
| Hardcode school name in seeder JSON | Store school name in `schools` table |
| Re-run ContentSeeder for each new school | Only run SchoolSeeder for each new school |
| Resolve school data in VisibilityService | Resolve in CompositionService after visibility check |
| Keep `entity_identities.json` with brand values | Move all brand values to DB; JSON is schema-only |

---

## Adding a New School (Future)

```bash
# On the server — that's all it takes
php artisan tinker
>>> School::create([
...   'slug'    => 'riyadh-academy',
...   'name'    => 'Riyadh Academy',
...   'name_ar' => 'أكاديمية الرياض',
...   'logo_url'=> '/storage/schools/riyadh-academy/logo.png',
...   'contact' => ['email' => 'info@riyadhacademy.sa'],
...   'active'  => true,
... ]);
```

`/school/riyadh-academy/` is live immediately — no JSON, no seeding, no deploy.
