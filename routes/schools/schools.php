<?php

use App\Http\Controllers\Admin\AuthController as SchoolAdminAuthController;
use App\Http\Controllers\Api\V1\Cms\BlockController as SchoolAdminBlockController;
use App\Http\Controllers\Api\V1\Cms\MediaController as SchoolAdminMediaController;
use App\Http\Controllers\Api\V1\Cms\SectionController as SchoolAdminSectionController;
use App\Http\Controllers\Api\V1\Content\ContentController;
use App\Http\Controllers\Api\V1\Content\NewsletterController;
use App\Http\Controllers\Api\V1\Content\PublicArticleController;
use App\Http\Controllers\Api\V1\Cms\PageController as SchoolAdminPageController;
use App\Http\Controllers\Public\SchoolApplicationController;
use App\Http\Controllers\Public\TeacherApplicationController;
use App\Http\Controllers\Schools\SchoolTemplateController;
use App\Http\Controllers\Schools\SchoolAssetController;

use Illuminate\Support\Facades\Route;

// ── School Application & Registration Routes ──────────────────────────────
Route::group(['prefix' => 'register', 'as' => 'register.'], function () {
    Route::get('/', [SchoolApplicationController::class, 'create'])->name('index');
    Route::post('/validate-school', [SchoolApplicationController::class, 'validateSchool'])->name('validate');
    Route::get('/select-subscription-plan', [SchoolApplicationController::class, 'selectPlan'])->name('select-subscription-plan');
    Route::post('/checkout', [SchoolApplicationController::class, 'checkout'])->name('checkout');
});

Route::get('/schools/apply', [SchoolApplicationController::class, 'create'])->name('schools.apply');
Route::post('/schools/apply', [SchoolApplicationController::class, 'store'])->name('schools.store.apply');

// ── School Subfolder Template & SEO Routes ─────────────────────────────────
// URL pattern: shafeea.system360.cloud/school/[school_code]
Route::group(['prefix' => 'school/{school_code}', 'as' => 'school.template.'], function () {
    // Search Engine Identification & Indexing (SEO)
    Route::get('/robots.txt', [SchoolTemplateController::class, 'robots'])->name('robots');
    Route::get('/sitemap.xml', [SchoolTemplateController::class, 'sitemap'])->name('sitemap');

    // Secure per-school Asset & Document Retrieval
    Route::get('/assets/{path}', [SchoolAssetController::class, 'show'])->where('path', '.*')->name('asset');

    // Main template info
    Route::get('/api/info', [SchoolTemplateController::class, 'info'])->name('info');

    // Public School API endpoints
    Route::group(['prefix' => 'api', 'as' => 'api.'], function () {
        Route::get('/content/{slug?}', [ContentController::class, 'show'])->where('slug', '.*');
        Route::get('/articles', [PublicArticleController::class, 'index']);
        Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

        // Admin API endpoints for school context
        Route::group(['prefix' => 'admin', 'as' => 'admin.'], function () {
            Route::post('/login', [SchoolAdminAuthController::class, 'login']);
            Route::get('/pages', [SchoolAdminPageController::class, 'index']);
            Route::get('/sections', [SchoolAdminSectionController::class, 'index']);
            Route::get('/blocks', [SchoolAdminBlockController::class, 'index']);
            Route::get('/media', [SchoolAdminMediaController::class, 'index']);
        });
    });

    // Per-school Teacher Application route
    Route::get('/teachers/apply', [TeacherApplicationController::class, 'create'])->name('teachers.apply');
    Route::post('/teachers/apply', [TeacherApplicationController::class, 'store'])->name('teachers.store.apply');

    // Main template views & SPA catch-all fallback route for school sub-pages
    Route::get('/', [SchoolTemplateController::class, 'index'])->name('index');
    Route::get('/{any?}', [SchoolTemplateController::class, 'show'])->where('any', '.*')->name('show');
});
