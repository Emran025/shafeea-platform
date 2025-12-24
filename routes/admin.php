<?php

use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AdminSchoolController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\PolicyController;
use App\Http\Controllers\Admin\ServiceController;
use Illuminate\Support\Facades\Route;

// Public admin login routes (accessible to guests only)
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->name('login.post');
});

// Protected admin routes (require authentication and admin privileges)
Route::middleware(['auth', 'admin'])->group(function () {
    // Dashboard - Use DashboardController instead of closure
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Logout
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

    // Schools management
    Route::prefix('schools')->name('schools.')->group(function () {
        Route::get('/', [AdminSchoolController::class, 'index'])->name('index');
        Route::get('/create', [AdminSchoolController::class, 'create'])->name('create');
        Route::post('/', [AdminSchoolController::class, 'store'])->name('store');
        Route::get('/{school}', [AdminSchoolController::class, 'show'])->name('show');
        Route::get('/{school}/edit', [AdminSchoolController::class, 'edit'])->name('edit');
        Route::put('/{school}', [AdminSchoolController::class, 'update'])->name('update');
        Route::delete('/{school}', [AdminSchoolController::class, 'destroy'])->name('destroy');
        Route::post('/{school}/approve', [AdminSchoolController::class, 'approve'])->name('approve');
        Route::post('/{school}/reject', [AdminSchoolController::class, 'reject'])->name('reject');
        Route::post('/{school}/suspend', [AdminSchoolController::class, 'suspend'])->name('suspend');
    });

    // Inquiries management
    Route::prefix('inquiries')->name('inquiries.')->group(function () {
        Route::get('/', [InquiryController::class, 'index'])->name('index');
        Route::get('/{inquiry}', [InquiryController::class, 'show'])->name('show');
        Route::put('/{inquiry}', [InquiryController::class, 'update'])->name('update');
        Route::post('/reorder', [InquiryController::class, 'reorder'])->name('reorder');
    });

    // Policies management
    Route::prefix('policies')->name('policies.')->group(function () {
        Route::get('/', [PolicyController::class, 'index'])->name('index');
        Route::get('/edit/{type}/{id}', [PolicyController::class, 'edit'])->name('edit');
        Route::post('/update/{type}/{id}', [PolicyController::class, 'update'])->name('update');
    });

    // Services management
    Route::resource('services', ServiceController::class)->names('services');

    // Admin account management
    Route::prefix('account')->name('account.')->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('index');
        Route::put('/profile', [AccountController::class, 'updateProfile'])->name('update-profile');
        Route::put('/password', [AccountController::class, 'updatePassword'])->name('update-password');
        Route::delete('/sessions/{sessionId}', [AccountController::class, 'terminateSession'])->name('terminate-session');
        // Route::post('/two-factor', [AccountController::class, 'enableTwoFactor'])->name('enable-two-factor');
    });
});
