<?php

namespace Database\Seeders;

use App\Models\Document;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            // Create a fake file
            $fileName = 'document_' . uniqid() . '.txt';
            $filePath = 'public/documents/' . $fileName;
            Storage::put($filePath, 'This is a sample document.');

            Document::create([
                'user_id' => $user->id,
                'name' => 'Sample Certificate',
                'certificate_type' => 'شهادة حفظ قران',
                'riwayah' => 'قراءة الإمام عاصم بن أبي النجود الكوفي',
                'issuing_place' => 'Sample Place',
                'issuing_date' => now()->subYears(rand(1, 5))->format('Y-m-d'),
                'file_path' => $filePath,
            ]);
        }
    }
}
