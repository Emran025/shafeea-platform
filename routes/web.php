<?php

use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HelpCenterController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\SupportController;
use App\Models\Faq;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use App\Models\LandingPageSetting;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $settings = LandingPageSetting::where('group', 'welcome_page')
        ->get()
        ->pluck('value', 'key');

    return Inertia::render('welcome', [
        'settings' => $settings
    ]);
})->name('welcome');

// Public pages
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/services', [ServiceController::class, 'index'])->name('services');

Route::get('/contact', [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/help', [HelpCenterController::class, 'index'])->name('help');
Route::get('/support', [SupportController::class, 'index'])->name('support');

Route::get('/terms', function () {
    $terms = TermsOfUse::where('is_active', true)->latest('last_updated')->first();

    return Inertia::render('terms', ['terms' => $terms]);
})->name('terms');

Route::get('/privacy', function () {
    $privacyPolicy = PrivacyPolicy::where('is_active', true)->latest('last_updated')->first();

    return Inertia::render('privacy', ['privacyPolicy' => $privacyPolicy]);
})->name('privacy');

Route::get('/faq', function () {
    $faqs = Faq::with('category', 'tags')
        ->where('is_active', true)
        ->where('display_order', 1)
        ->orderBy('display_order', 'asc')
        ->get();

    return Inertia::render('faq', ['faqs' => $faqs]);
})->name('faq');


// require __DIR__ . '/auth.php';
