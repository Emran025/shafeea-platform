<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

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
    return Inertia::render('terms');
})->name('terms');

Route::get('/privacy', function () {
    return Inertia::render('privacy');
})->name('privacy');

Route::get('/faq', function () {
    return Inertia::render('faq');
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


use App\Http\Controllers\Admin\AdminSchoolController;

// Admin School Management
Route::prefix('admin/schools')->name('admin.schools.')->middleware(['auth', 'admin'])->group(function () {
    Route::get('/', [AdminSchoolController::class, 'index'])->name('index');
    Route::post('/{school}/approve', [AdminSchoolController::class, 'approve'])->name('approve');
    Route::post('/{school}/reject', [AdminSchoolController::class, 'reject'])->name('reject');
    Route::post('/{school}/suspend', [AdminSchoolController::class, 'suspend'])->name('suspend');
});

require __DIR__.'/auth.php';
