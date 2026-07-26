<?php

namespace App\Providers;

use App\Models\Cms\Block;
use App\Models\Cms\Page;
use App\Models\Cms\Section;
use App\Observers\BlockObserver;
use App\Observers\PageObserver;
use App\Observers\SectionObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Load domain-structured migrations
        $this->loadMigrationsFrom([
            database_path('migrations/Core'),
            database_path('migrations/Auth'),
            database_path('migrations/School'),
            database_path('migrations/Academic'),
            database_path('migrations/Content'),
            database_path('migrations/Cms'),
        ]);

        // Register CMS Engine Observers for write-time constraint enforcement
        Page::observe(PageObserver::class);
        Section::observe(SectionObserver::class);
        Block::observe(BlockObserver::class);
    }
}
