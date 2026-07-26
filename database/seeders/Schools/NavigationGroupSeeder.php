<?php

namespace Database\Seeders\Schools;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

/**
 * NavigationGroupSeeder — Phase 1 mega-menu navigation structure.
 *
 * Seeds the NavigationGroup → NavColumn → NavEntry hierarchy that
 * the CompositionService composes into the navigation contract.
 *
 * Groups:
 *   1. Platforms      — dropdown (3 platform links + platform overview)
 *   2. Company        — dropdown (About, Contact)
 */
class NavigationGroupSeeder extends Seeder
{
    public function run(): void
    {
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();

        // Truncate in dependency order to allow re-running cleanly
        DB::table('navigation_entries')->delete();
        DB::table('navigation_columns')->delete();
        DB::table('navigation_groups')->delete();

        $dir = database_path('content/navigation');

        if (! is_dir($dir)) {
            throw new \RuntimeException("NavigationGroupSeeder: navigation directory not found at {$dir}");
        }

        $files = glob($dir . '/*.json');
        if (empty($files)) {
            throw new \RuntimeException("NavigationGroupSeeder: no .json files found in {$dir}");
        }

        sort($files);

        foreach ($files as $file) {
            $group = json_decode(file_get_contents($file), true, 512, JSON_THROW_ON_ERROR);

            DB::table('navigation_groups')->insert([
                'id'         => $group['id'],
                'group_id'   => $group['group_id'],
                'label'      => json_encode($group['label']),
                'type'       => $group['type'],
                'position'   => $group['position'],
                'is_active'  => $group['is_active'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($group['columns'] as $idx => $col) {
                $colLabel = $col['label'];
                if ($colLabel !== null) {
                    $colLabel = is_array($colLabel) ? json_encode($colLabel) : json_encode(['en' => $colLabel]);
                }

                DB::table('navigation_columns')->insert([
                    'id'                  => $col['id'],
                    'navigation_group_id' => $group['id'],
                    'column_id'           => $col['column_id'],
                    'label'               => $colLabel,
                    'position'            => $idx + 1,
                    'featured_block'      => null,
                    'created_at'          => now(),
                    'updated_at'          => now(),
                ]);

                foreach ($col['entries'] as $eIdx => $e) {
                    $groupPrefix = substr($group['id'], 0, 24);
                    $entryId = ($group['type'] === 'direct_link')
                        ? $groupPrefix . '000000000001'
                        : $groupPrefix . str_pad(($idx + 1) * 100 + ($eIdx + 1), 12, '0', STR_PAD_LEFT);

                    $entryLabel = is_array($e['label']) ? json_encode($e['label']) : json_encode(['en' => $e['label']]);
                    $badgeText = null;
                    if (isset($e['badge'])) {
                        $badgeText = is_array($e['badge']) ? json_encode($e['badge']) : json_encode(['en' => $e['badge']]);
                    }

                    DB::table('navigation_entries')->insert([
                        'id'                   => $entryId,
                        'navigation_column_id' => $col['id'],
                        'label'                => $entryLabel,
                        'destination_type'     => 'internal_page',
                        'destination_value'    => $e['slug'],
                        'position'             => $eIdx + 1,
                        'is_badge_highlighted' => isset($e['badge']) ? true : false,
                        'badge_text'           => $badgeText,
                        'created_at'           => now(),
                        'updated_at'           => now(),
                    ]);
                }
            }
        }

        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        $this->command->info('NavigationGroupSeeder: mega-menu navigation seeded.');
    }
}
