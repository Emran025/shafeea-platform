<?php

namespace Database\Seeders\Schools;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            // ─────────────────────────────────────────────────────────────────
            // JSON-driven seeders (canonical path — edit JSON files, not PHP)
            // ─────────────────────────────────────────────────────────────────

            // 0. Admin users / roles / permissions / topics
            //    Source: database/content/admin/{users,permissions,role_permissions,topics,topic_assignments}.json
            AdminAccessSeeder::class,

            // 1. Entity identities / platform registry / product sites / media / all pages
            //    Source: database/content/admin/{entity_identities,platform_registry,product_sites,media}.json
            //            database/content/pages/*.json
            ContentSeeder::class,

            // 2. Mega-menu navigation groups
            //    Source: database/content/navigation/*.json
            NavigationGroupSeeder::class,
        ]);
    }
}
