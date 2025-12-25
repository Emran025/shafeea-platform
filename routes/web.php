<?php

use App\Models\Faq;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Public pages
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/services', [\App\Http\Controllers\ServiceController::class, 'index'])->name('services');

Route::get('/contact', [\App\Http\Controllers\ContactController::class, 'index'])->name('contact');
Route::post('/contact', [\App\Http\Controllers\ContactController::class, 'store'])->name('contact.store');

Route::get('/help', [\App\Http\Controllers\HelpCenterController::class, 'index'])->name('help');
Route::get('/support', [\App\Http\Controllers\SupportController::class, 'index'])->name('support');

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
