<?php

namespace App\Http\Controllers\Api\V1\Content;

use App\Http\Controllers\Controller;
use App\Models\Cms\Block;
use App\Models\Cms\Page;
use App\Models\Auth\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicArticleController extends Controller
{
    /** GET /api/articles — paginated list of published articles. */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 50);

        // Always check whether any DB articles exist.
        $hasPublished = Page::where('type', 'newsroom.article')
            ->where('status', 'published')
            ->exists();

        if ($hasPublished) {
            // Eager-load the prose_body / rich_text section so we can extract
            // category and tags per article without N+1 queries.
            $paginated = Page::query()
                ->where('type', 'newsroom.article')
                ->where('status', 'published')
                ->with([
                    'sections' => fn($q) => $q
                        ->whereIn('type', ['prose_body', 'rich_text'])
                        ->with('blocks'),
                ])
                ->orderByDesc('published_at')
                ->paginate($perPage);

            $paginated->getCollection()->transform(function ($page) {
                $ogImage = $page->meta_og_image;
                $page->cover_image_url = is_array($ogImage) ? ($ogImage['url'] ?? null) : null;
                $page->author = $this->resolveAuthor($page);

                // Extract category + tags from the rich_text block inside the
                // prose_body section (stored alongside body/excerpt).
                $page->category = null;
                $page->tags     = [];
                $section = $page->sections->first();
                if ($section) {
                    $bodyBlock = $section->blocks->firstWhere('type', 'rich_text');
                    if ($bodyBlock) {
                        $fields = $bodyBlock->locale_content['en']['fields'] ?? [];
                        $page->category = $fields['category'] ?? null;
                        $page->tags     = $fields['tags']     ?? [];
                    }
                }

                return $page;
            });

            return response()->json($paginated);
        }

        // Fall back to editorial blocks of type news_article_card when no DB
        // articles exist yet.
        $blocks = Block::where('type', 'news_article_card')->get();
        $data   = [];
        foreach ($blocks as $block) {
            $enContent = $block->locale_content['en']['fields'] ?? [];
            $title     = $enContent['title'] ?? '';
            if (!$title) continue;
            $slug      = self::titleToSlug($title);
            $storedImg = isset($enContent['image_url']) && $enContent['image_url'] !== ''
                ? $enContent['image_url']
                : null;
            $data[] = [
                'id'              => $block->id,
                'slug'            => $slug,
                'title'           => $title,
                'cover_image_url' => $storedImg,
                'published_at'    => null,
                'excerpt'         => $enContent['excerpt']  ?? null,
                'category'        => $enContent['category'] ?? null,
                'tags'            => $enContent['tags']     ?? [],
                'date'            => $enContent['date']     ?? null,
                'author'          => null,
                'source'          => 'editorial',
            ];
        }

        return response()->json([
            'current_page' => 1,
            'data'         => $data,
            'from'         => 1,
            'last_page'    => 1,
            'per_page'     => $perPage,
            'to'           => count($data),
            'total'        => count($data),
        ]);
    }

    /** GET /api/articles/{slug} — single published article with body content. */
    public function show(string $slug): JsonResponse
    {
        // 1. Try to find a real published page row first.
        $page = Page::query()
            ->where('type', 'newsroom.article')
            ->where('status', 'published')
            ->where('slug', $slug)
            ->first();

        if ($page) {
            return $this->pageResponse($page);
        }

        // 2. Fall back to searching editorial news_article_card blocks.
        $blocks = Block::where('type', 'news_article_card')->get();
        foreach ($blocks as $block) {
            $enContent = $block->locale_content['en']['fields'] ?? [];
            $title     = $enContent['title'] ?? '';
            if (!$title) continue;
            if (self::titleToSlug($title) === $slug) {
                $storedImg = isset($enContent['image_url']) && $enContent['image_url'] !== ''
                    ? $enContent['image_url']
                    : null;
                return response()->json([
                    'id'              => $block->id,
                    'slug'            => $slug,
                    'title'           => $title,
                    'cover_image_url' => $storedImg,
                    'published_at'    => null,
                    'excerpt'         => $enContent['excerpt']  ?? null,
                    'body'            => null,
                    'category'        => $enContent['category'] ?? null,
                    'tags'            => $enContent['tags']     ?? [],
                    'date'            => $enContent['date']     ?? null,
                    'author'          => null,
                    'source'          => 'editorial',
                ]);
            }
        }

        return response()->json(['error' => 'Article not found'], 404);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private function pageResponse(Page $page): JsonResponse
    {
        $ogImage       = $page->meta_og_image;
        $coverImageUrl = is_array($ogImage) ? ($ogImage['url'] ?? null) : null;
        $body          = null;
        $excerpt       = null;
        $category      = null;
        $tags          = [];

        $section = $page->sections()
            ->whereIn('type', ['prose_body', 'rich_text'])
            ->with(['blocks' => fn($q) => $q->orderByPivot('position')])
            ->first();

        if ($section) {
            $bodyBlock = $section->blocks->firstWhere('type', 'rich_text');
            if ($bodyBlock) {
                $fields   = $bodyBlock->locale_content['en']['fields'] ?? [];
                $body     = $fields['body']     ?? null;
                $excerpt  = $fields['excerpt']  ?? null;
                $category = $fields['category'] ?? null;
                $tags     = $fields['tags']     ?? [];
            }
        }

        return response()->json([
            'id'              => $page->id,
            'slug'            => $page->slug,
            'title'           => $page->identity_title['en'] ?? collect($page->identity_title)->first(),
            'cover_image_url' => $coverImageUrl,
            'published_at'    => $page->published_at,
            'excerpt'         => $excerpt,
            'body'            => $body,
            'category'        => $category,
            'tags'            => $tags,
            'date'            => null,
            'author'          => $this->resolveAuthor($page),
            'source'          => 'published',
        ]);
    }

    /**
     * Resolve author info from the page's published_by or created_by UUID.
     */
    private function resolveAuthor(Page $page): ?array
    {
        $authorId = $page->published_by ?? $page->created_by ?? null;
        if (!$authorId) return null;

        try {
            $user = User::find($authorId);
            if (!$user) return null;

            return [
                'id'   => $user->id,
                'name' => $user->name,
                'role' => $user->role ?? 'Editor',
            ];
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Convert a title to a URL slug — must match the frontend titleToSlug() exactly.
     */
    private static function titleToSlug(string $title): string
    {
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9\s\-]/', '', $slug);
        $slug = trim($slug);
        $slug = preg_replace('/\s+/', '-', $slug);
        $slug = preg_replace('/-+/', '-', $slug);
        return substr($slug, 0, 80);
    }
}
