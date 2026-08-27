<?php

use App\Http\Controllers\Api\V1\Cms as Admin;
use App\Http\Controllers\Api\V1\Cms\Inquiry;
use App\Http\Controllers\Api\V1\Content\ContentController;
use App\Http\Controllers\Api\V1\Content\NewsletterController;
use App\Http\Controllers\Api\V1\Content\NewsroomNavigationController;
use App\Http\Controllers\Api\V1\Content\PublicArticleController;
use App\Http\Controllers\Public\SchoolApplicationController;
use App\Http\Controllers\Public\TeacherApplicationController;
use App\Http\Controllers\Schools\SchoolAssetController;
use App\Http\Controllers\Schools\SchoolTemplateController;
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

    // ── Public content API ────────────────────────────────────────────────
    Route::get('/content/{slug}', [ContentController::class, 'show'])->where('slug', '.*');
    Route::get('/newsroom-links', [NewsroomNavigationController::class, 'index']);
    Route::get('/articles', [PublicArticleController::class, 'index']);
    Route::get('/articles/{slug}', [PublicArticleController::class, 'show']);
    Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);

    /*
|--------------------------------------------------------------------------
| Admin & Authoring API
|--------------------------------------------------------------------------
|
| All admin routes live under /school/{school_code}/admin/.
| Actor identity is resolved from the Bearer token (Sanctum / admin.auth).
|
*/

    Route::prefix('admin')->group(function () {
        Route::post('auth/login', [Admin\AuthController::class, 'login']);

        Route::middleware('admin.auth')->group(function () {
            Route::get('auth/me', [Admin\AuthController::class, 'me']);
            Route::post('auth/logout', [Admin\AuthController::class, 'logout']);
            Route::get('users', [Admin\UsersController::class, 'index'])->middleware('require.permission:manage_users');
            Route::post('users', [Admin\UsersController::class, 'store'])->middleware('require.permission:manage_users');
            Route::put('users/{user}', [Admin\UsersController::class, 'update'])->middleware('require.permission:manage_users');
            Route::delete('users/{user}', [Admin\UsersController::class, 'destroy'])->middleware('require.permission:manage_users');
            Route::get('topics', [Admin\TopicsController::class, 'index']);
            Route::post('topics', [Admin\TopicsController::class, 'store']);
            Route::put('topics/{topic}', [Admin\TopicsController::class, 'update']);
            Route::delete('topics/{topic}', [Admin\TopicsController::class, 'destroy']);
            Route::get('permissions/matrix', [Admin\PermissionsMatrixController::class, 'index'])->middleware('require.permission:manage_permissions');
            Route::put('permissions/matrix', [Admin\PermissionsMatrixController::class, 'update'])->middleware('require.permission:manage_permissions');

            // ------------------------------------------------------------------
            // Page authoring
            // ------------------------------------------------------------------
            Route::get('pages', [Admin\PageController::class, 'index']);
            Route::post('pages', [Admin\PageController::class, 'store']);
            Route::get('pages/{page}', [Admin\PageController::class, 'show']);
            Route::put('pages/{page}', [Admin\PageController::class, 'update']);
            Route::delete('pages/{page}', [Admin\PageController::class, 'destroy']);

            // ------------------------------------------------------------------
            // Section authoring
            // ------------------------------------------------------------------
            Route::get('sections', [Admin\SectionController::class, 'index']);
            // Section Compose — must be declared BEFORE /{section} to avoid conflict
            Route::post('sections/compose', [Admin\SectionComposeController::class, 'store']);
            Route::post('sections', [Admin\SectionController::class, 'store']);
            Route::get('sections/{section}', [Admin\SectionController::class, 'show']);
            Route::put('sections/{section}', [Admin\SectionController::class, 'update']);
            Route::put('sections/{section}/compose', [Admin\SectionComposeController::class, 'update']);
            Route::delete('sections/{section}', [Admin\SectionController::class, 'destroy']);
            Route::post('sections/{section}/blocks/{block}', [Admin\SectionController::class, 'attachBlock']);
            Route::delete('sections/{section}/blocks/{block}', [Admin\SectionController::class, 'detachBlock']);

            // ------------------------------------------------------------------
            // Block authoring
            // ------------------------------------------------------------------
            Route::post('blocks', [Admin\BlockController::class, 'store']);
            Route::get('blocks/{block}', [Admin\BlockController::class, 'show']);
            Route::put('blocks/{block}', [Admin\BlockController::class, 'update']);
            Route::delete('blocks/{block}', [Admin\BlockController::class, 'destroy']);

            // ------------------------------------------------------------------
            // Media
            // ------------------------------------------------------------------
            Route::get('media', [Admin\MediaController::class, 'index']);
            Route::post('media/upload', [Admin\MediaController::class, 'upload']);
            Route::post('media', [Admin\MediaController::class, 'store']);
            Route::get('media/{media}', [Admin\MediaController::class, 'show']);
            Route::put('media/{media}', [Admin\MediaController::class, 'update']);
            Route::post('media/{media}/ready', [Admin\MediaController::class, 'setReady']);
            Route::delete('media/{media}', [Admin\MediaController::class, 'destroy']);

            // ------------------------------------------------------------------
            // Workflow transitions
            // ------------------------------------------------------------------
            Route::post('workflow/{type}/{id}/submit', [Admin\WorkflowController::class, 'submit']);
            Route::post('workflow/{type}/{id}/request-changes', [Admin\WorkflowController::class, 'requestChanges']);
            Route::post('workflow/{type}/{id}/approve', [Admin\WorkflowController::class, 'approve']);
            Route::post('workflow/{type}/{id}/publish', [Admin\WorkflowController::class, 'publish']);
            Route::post('workflow/{type}/{id}/schedule', [Admin\WorkflowController::class, 'schedule']);
            Route::post('workflow/{type}/{id}/unpublish', [Admin\WorkflowController::class, 'unpublish']);

            // ------------------------------------------------------------------
            // Publish bundles (WR-006 atomic bundle publishing)
            // ------------------------------------------------------------------
            Route::post('bundles', [Admin\PublishBundleController::class, 'store']);
            Route::get('bundles/{bundle}', [Admin\PublishBundleController::class, 'show']);
            Route::post('bundles/{bundle}/members', [Admin\PublishBundleController::class, 'addMember']);
            Route::post('bundles/{bundle}/ready', [Admin\PublishBundleController::class, 'markReady']);
            Route::post('bundles/{bundle}/publish', [Admin\PublishBundleController::class, 'publish']);
            Route::post('bundles/{bundle}/cancel', [Admin\PublishBundleController::class, 'cancel']);

            // ------------------------------------------------------------------
            // Platform registry & entity identities (read-only from admin API)
            // ------------------------------------------------------------------
            Route::get('platforms', [Admin\PlatformController::class, 'index']);
            Route::get('platforms/{id}', [Admin\PlatformController::class, 'show']);
            Route::get('entity-identities', [Admin\PlatformController::class, 'identities']);

            // ------------------------------------------------------------------
            // Navigation manager
            // ------------------------------------------------------------------
            Route::get('navigation/groups', [Admin\NavigationGroupController::class,  'index']);
            Route::post('navigation/groups', [Admin\NavigationGroupController::class,  'store']);
            Route::put('navigation/groups/{navigationGroup}', [Admin\NavigationGroupController::class,  'update']);
            Route::delete('navigation/groups/{navigationGroup}', [Admin\NavigationGroupController::class,  'destroy']);
            Route::post('navigation/columns', [Admin\NavigationColumnController::class, 'store']);
            Route::put('navigation/columns/{navigationColumn}', [Admin\NavigationColumnController::class, 'update']);
            Route::delete('navigation/columns/{navigationColumn}', [Admin\NavigationColumnController::class, 'destroy']);
            Route::post('navigation/entries', [Admin\NavigationEntryController::class,  'store']);
            Route::put('navigation/entries/{navigationEntry}', [Admin\NavigationEntryController::class,  'update']);
            Route::delete('navigation/entries/{navigationEntry}', [Admin\NavigationEntryController::class,  'destroy']);

            // ------------------------------------------------------------------
            // Audit trail — append-only status_transitions log
            // ------------------------------------------------------------------
            Route::get('transitions/{type}/{id}', [Admin\WorkflowController::class, 'transitions']);

            // ------------------------------------------------------------------
            // Newsletter subscriptions (admin read)
            // ------------------------------------------------------------------
            Route::get('newsletter/subscriptions', [NewsletterController::class, 'index']);

            // ------------------------------------------------------------------
            // Inquiry management (T5 tier) — each channel guarded by its own permission
            // ------------------------------------------------------------------
            Route::prefix('inquiry')->group(function () {

                // Email inquiries — inquiry.email + inquiry.manager + platform.admin
                Route::middleware('require.permission:manage_email_inquiries')->group(function () {
                    Route::get('emails', [Inquiry\EmailInquiryController::class, 'index']);
                    Route::get('emails/{emailInquiry}', [Inquiry\EmailInquiryController::class, 'show']);
                    Route::patch('emails/{emailInquiry}', [Inquiry\EmailInquiryController::class, 'update']);
                    Route::delete('emails/{emailInquiry}', [Inquiry\EmailInquiryController::class, 'destroy']);
                });

                // Support tickets — inquiry.support + inquiry.manager + platform.admin
                Route::middleware('require.permission:manage_support_tickets')->group(function () {
                    Route::get('support-tickets', [Inquiry\SupportTicketController::class, 'index']);
                    Route::get('support-tickets/{supportTicket}', [Inquiry\SupportTicketController::class, 'show']);
                    Route::patch('support-tickets/{supportTicket}', [Inquiry\SupportTicketController::class, 'update']);
                    Route::delete('support-tickets/{supportTicket}', [Inquiry\SupportTicketController::class, 'destroy']);
                });

                // FAQ categories — inquiry.faq + inquiry.manager + platform.admin
                Route::middleware('require.permission:manage_faq')->group(function () {
                    Route::get('faq-categories', [Inquiry\FaqCategoryController::class, 'index']);
                    Route::post('faq-categories', [Inquiry\FaqCategoryController::class, 'store']);
                    Route::put('faq-categories/{faqCategory}', [Inquiry\FaqCategoryController::class, 'update']);
                    Route::delete('faq-categories/{faqCategory}', [Inquiry\FaqCategoryController::class, 'destroy']);

                    // FAQ entries
                    Route::get('faqs', [Inquiry\FaqController::class, 'index']);
                    Route::post('faqs', [Inquiry\FaqController::class, 'store']);
                    Route::get('faqs/{faq}', [Inquiry\FaqController::class, 'show']);
                    Route::put('faqs/{faq}', [Inquiry\FaqController::class, 'update']);
                    Route::delete('faqs/{faq}', [Inquiry\FaqController::class, 'destroy']);
                    Route::post('faqs/{faq}/publish', [Inquiry\FaqController::class, 'publish']);
                    Route::post('faqs/{faq}/unpublish', [Inquiry\FaqController::class, 'unpublish']);
                });
            });
        });
    });

    // Per-school Teacher Application route
    Route::get('/teachers/apply', [TeacherApplicationController::class, 'create'])->name('teachers.apply');
    Route::post('/teachers/apply', [TeacherApplicationController::class, 'store'])->name('teachers.store.apply');

    // Main template views & SPA catch-all fallback route for school sub-pages
    Route::get('/', [SchoolTemplateController::class, 'index'])->name('index');
    Route::get('/{any?}', [SchoolTemplateController::class, 'show'])->where('any', '.*')->name('show');
});
