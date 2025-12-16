<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ContentType;

class ContentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = [
            ['name' => 'الأسئلة الشائعة', 'slug' => 'faq'],
            ['name' => 'سياسة الخصوصية', 'slug' => 'privacy-policy'],
            ['name' => 'شروط الاستخدام', 'slug' => 'terms-of-use'],
            ['name' => 'محتوى عام', 'slug' => 'general-content'],
        ];

        foreach ($types as $type) {
            $this->smartUpdateOrCreate(ContentType::class, ['slug' => $type['slug']], $type);
        }
    }

    /**
     * Helper to safely update or create records, handling SoftDeletes automatically.
     */
    private function smartUpdateOrCreate($modelClass, array $searchConditions, array $data = [])
    {
        $query = $modelClass::query();

        // Check if model uses SoftDeletes dynamically
        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($modelClass))) {
            $query->withTrashed();
        }

        $record = $query->updateOrCreate($searchConditions, $data);

        // Restore if trashed
        if (method_exists($record, 'trashed') && $record->trashed()) {
            $record->restore();
        }

        return $record;
    }
}
