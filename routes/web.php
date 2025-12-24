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

Route::get('/contact', function () {
    return Inertia::render('contact');
})->name('contact');

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

// Contact form submission
Route::post('/contact', function (\Illuminate\Http\Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'subject' => 'required|string|max:255',
        'message_type' => 'required|string|in:support,sales,partnership,feedback,other',
        'message' => 'required|string|max:2000',
        'organization' => 'nullable|string|max:255',
    ]);

    return redirect()->back()->with('success', 'تم إرسال رسالتك بنجاح!');
})->name('contact.store');

// Include admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    require __DIR__.'/admin.php';
});

// require __DIR__ . '/auth.php';
