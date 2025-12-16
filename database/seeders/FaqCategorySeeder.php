<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FaqCategory;

class FaqCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'أسئلة عامة', 'display_order' => 1],
            ['name' => 'الدعم الفني', 'display_order' => 2],
            ['name' => 'الأسعار والخطط', 'display_order' => 3],
            ['name' => 'أدلة المستخدم', 'display_order' => 4],
        ];

        foreach ($categories as $category) {
            $this->smartUpdateOrCreate(FaqCategory::class, ['name' => $category['name']], $category);
        }
    }

    /**
     * Helper to safely update or create records, handling SoftDeletes automatically.
     */
    private function smartUpdateOrCreate($modelClass, array $searchConditions, array $data = [])
    {
        $query = $modelClass::query();

        if (in_array('Illuminate\Database\Eloquent\SoftDeletes', class_uses_recursive($modelClass))) {
            $query->withTrashed();
        }

        $record = $query->updateOrCreate($searchConditions, $data);

        if (method_exists($record, 'trashed') && $record->trashed()) {
            $record->restore();
        }

        return $record;
    }
}