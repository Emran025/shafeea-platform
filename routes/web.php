<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\PrivacyPolicy;
use App\Models\TermsOfUse;
use App\Models\Faq;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

// Public pages
Route::get('/about', function () {
    return Inertia::render('about');
})->name('about');

Route::get('/services', function () {
    return Inertia::render('services');
})->name('services');

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
    $faqs = Faq::with('category', 'tags')->where('is_active', true)->get();
    return Inertia::render('faq', ['faqs' => $faqs]);
})->name('faq');

// Contact form submission
Route::post('/contact', function (\Illuminate\Http\Request $request) {
    // Basic validation
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
        'phone' => 'nullable|string|max:20',
        'subject' => 'required|string|max:255',
        'message_type' => 'required|string|in:support,sales,partnership,feedback,other',
        'message' => 'required|string|max:2000',
        'organization' => 'nullable|string|max:255',
    ]);

    // Here you would typically save to database or send email
    // For now, we'll just return success

    return redirect()->back()->with('success', 'تم إرسال رسالتك بنجاح!');
})->name('contact.store');


// Include admin routes
Route::prefix('admin')->name('admin.')->group(function () {
    require __DIR__ . '/admin.php';
});

// require __DIR__ . '/auth.php';
