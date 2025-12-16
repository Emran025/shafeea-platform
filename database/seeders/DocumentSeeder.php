<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
            // Use a fixed name/type key to prevent creating a new file/record every deployment
            $documentName = 'Sample Certificate';
            
            // Check if document exists before creating a new file to save storage
            $exists = Document::where('user_id', $user->id)
                ->where('name', $documentName)
                ->exists();

            $filePath = 'public/documents/document_' . $user->id . '.txt';

            if (!$exists) {
                Storage::put($filePath, 'This is a sample document for user ' . $user->id);
            }

            $this->smartUpdateOrCreate(Document::class, 
                [
                    'user_id' => $user->id,
                    'name' => $documentName
                ], 
                [
                    'certificate_type' => 'شهادة حفظ قران',
                    'riwayah' => 'قراءة الإمام عاصم بن أبي النجود الكوفي',
                    'issuing_place' => 'Sample Place',
                    'issuing_date' => now()->subYears(rand(1, 5))->format('Y-m-d'),
                    'file_path' => $filePath,
                ]
            );
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