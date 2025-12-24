<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * 
     * Seeds services from JSON file
     */
    public function run(): void
    {
        // Path to services JSON file
        $jsonPath = database_path('data/services.json');

        if (!file_exists($jsonPath)) {
            $this->command->warn('⚠️  Services JSON file not found. Skipping seeder.');
            $this->command->info('Expected path: ' . $jsonPath);
            return;
        }

        // Load services from JSON
        $services = json_decode(file_get_contents($jsonPath), true);

        if (empty($services)) {
            $this->command->warn('⚠️  No services found in JSON file.');
            return;
        }

        // Clear existing services to avoid duplicates
        Service::query()->delete();

        foreach ($services as $serviceData) {
            Service::create([
                'category' => $serviceData['category'],
                'title' => $serviceData['title'],
                'description' => $serviceData['description'],
                'icon' => $serviceData['icon'],
                'image' => $serviceData['image'],
                'features' => $serviceData['features'],
                'benefits' => $serviceData['benefits'],
                'popular' => $serviceData['popular'] ?? false,
                'theme' => $serviceData['theme'],
                'display_order' => $serviceData['display_order'] ?? 0,
                'is_active' => true,
            ]);
        }

        $this->command->info('✅ Created ' . Service::count() . ' services from JSON file.');
    }
}
