<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\HelpController;
use App\Http\Controllers\Api\V1\HelpTicketController;
use App\Http\Controllers\Api\V1\Admin\HelpController as AdminHelpController;

Route::prefix('api/v1')->group(function () {
    /*
    |--------------------------------------------------------------------------
    | Help API Routes
    |--------------------------------------------------------------------------
    |
    | Here are the public API routes for the help section.
    |
    */

    // Public Help Routes
    Route::prefix('help')->name('help.')->group(function () {
        // FAQ Endpoints
        Route::get('faq-categories', [HelpController::class, 'getFaqCategories'])->name('faq-categories.list');
        Route::get('faq-categories/{id}/faqs', [HelpController::class, 'getFaqsByCategory'])->name('faq-categories.faqs');
        Route::get('faqs', [HelpController::class, 'listFaqs'])->name('faqs.list');
        Route::get('faqs/search/{query}', [HelpController::class, 'searchFaqs'])->name('faqs.search');
        Route::get('faqs/{id}', [HelpController::class, 'getFaqById'])->name('faqs.show');

        // Privacy Policy Endpoints
        Route::get('privacy-policy', [HelpController::class, 'getLatestPrivacyPolicy'])->name('privacy-policy.latest');
        Route::get('privacy-policy/versions', [HelpController::class, 'listPrivacyPolicyVersions'])->name('privacy-policy.versions');
        Route::get('privacy-policy/{version}', [HelpController::class, 'getPrivacyPolicyByVersion'])->name('privacy-policy.show');

        // Terms of Use Endpoints
        Route::get('terms-of-use', [HelpController::class, 'getLatestTermsOfUse'])->name('terms.latest');
        Route::get('terms-of-use/versions', [HelpController::class, 'listTermsOfUseVersions'])->name('terms.versions');
        Route::get('terms-of-use/{version}', [HelpController::class, 'getTermsOfUseByVersion'])->name('terms.show');

        // Content & Tag Endpoints
        Route::get('content-types', [HelpController::class, 'listContentTypes'])->name('content-types.list');
        Route::get('tags', [HelpController::class, 'listTags'])->name('tags.list');
        Route::get('tags/popular', [HelpController::class, 'getPopularTags'])->name('tags.popular');
    });

    /*
    |--------------------------------------------------------------------------
    | Authenticated and Admin Help API Routes
    |--------------------------------------------------------------------------
    |
    | Here are the authenticated and admin-only API routes for managing the help section.
    |
    */

    Route::middleware(['auth:sanctum'])->prefix('help')->name('help.')->group(function () {
        // User Consent Endpoints
        Route::post('privacy-policy/consent', [HelpController::class, 'recordPrivacyConsent'])->name('privacy-policy.consent');
        Route::post('terms-of-use/consent', [HelpController::class, 'recordTermsConsent'])->name('terms.consent');

        // Help Ticket Endpoint
        Route::post('tickets', [HelpTicketController::class, 'store'])->name('tickets.store');

        // Admin-only Routes
        Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
            // FAQ Category Management
            Route::post('faq-categories', [AdminHelpController::class, 'createFaqCategory'])->name('faq-categories.create');
            Route::put('faq-categories/{id}', [AdminHelpController::class, 'updateFaqCategory'])->name('faq-categories.update');
            Route::delete('faq-categories/{id}', [AdminHelpController::class, 'deleteFaqCategory'])->name('faq-categories.delete');

            // FAQ Management
            Route::post('faqs', [AdminHelpController::class, 'createFaq'])->name('faqs.create');
            Route::put('faqs/{id}', [AdminHelpController::class, 'updateFaq'])->name('faqs.update');
            Route::delete('faqs/{id}', [AdminHelpController::class, 'deleteFaq'])->name('faqs.delete');
            Route::post('faqs/{id}/tags', [AdminHelpController::class, 'attachTagsToFaq'])->name('faqs.tags.attach');
            Route::delete('faqs/{id}/tags/{tagId}', [AdminHelpController::class, 'detachTagFromFaq'])->name('faqs.tags.detach');

            // Policy Management
            Route::post('privacy-policy', [AdminHelpController::class, 'createOrUpdatePrivacyPolicy'])->name('privacy-policy.create_update');
            Route::post('terms-of-use', [AdminHelpController::class, 'createOrUpdateTermsOfUse'])->name('terms.create_update');
        });
    });
});
