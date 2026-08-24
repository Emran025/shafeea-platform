<?php

use App\Http\Controllers\Public\ContactController;
use App\Http\Controllers\Public\HelpCenterController;
use App\Http\Controllers\Public\PageController;
use App\Http\Controllers\Public\ServiceController;
use App\Http\Controllers\Public\SupportController;
use App\Http\Controllers\Public\UsernameController;
use Illuminate\Support\Facades\Route;

// ── Public pages ──────────────────────────────────────────────────────────────
// All routes use controller actions (not closures) so php artisan route:cache
// can serialize them without throwing LogicException.

Route::get('/',        [PageController::class, 'welcome'])->name('welcome');
Route::get('/about',   [PageController::class, 'about'])->name('about');
Route::get('/privacy', [PageController::class, 'privacy'])->name('privacy');
Route::get('/terms',   [PageController::class, 'terms'])->name('terms');
Route::get('/faq',     [PageController::class, 'faq'])->name('faq');

Route::get('/services', [ServiceController::class, 'index'])->name('services');

Route::get('/contact',  [ContactController::class, 'index'])->name('contact');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::get('/help',    [HelpCenterController::class, 'index'])->name('help');
Route::get('/support', [SupportController::class, 'index'])->name('support');

Route::get('/download', [PageController::class, 'download'])->name('download');

Route::get('/countries', [\App\Http\Controllers\Public\CountryController::class, 'index'])->name('countries.index');

Route::get('/username/suggest', [UsernameController::class, 'suggest'])
    ->name('username.suggest')
    ->middleware('throttle:60,1');


Route::middleware('auth')->group(function () {
    Route::get('dashboard', [PageController::class, 'dashboard'])
        ->name('dashboard');

    Route::get('verify-email', [\App\Http\Controllers\Auth\EmailVerificationPromptController::class, '__invoke'])
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', [\App\Http\Controllers\Auth\VerifyEmailController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('web.verification.verify');

    Route::post('email/verification-notification', [\App\Http\Controllers\Auth\EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');
});

