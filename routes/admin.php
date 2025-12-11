<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\AdminSchoolController;
use App\Http\Controllers\Admin\InquiryController;
use App\Http\Controllers\Admin\PolicyController;
use App\Http\Controllers\Admin\AccountController;
use Inertia\Inertia;

// Publicly accessible login routes
Route::get('login', [AuthController::class, 'showLoginForm'])->name('admin.login');
Route::post('login', [AuthController::class, 'login']);

// Authenticated and admin-protected routes
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

    Route::prefix('schools')->name('admin.schools.')->group(function () {
        Route::get('/', [AdminSchoolController::class, 'index'])->name('index');
        Route::get('/pending', [AdminSchoolController::class, 'pending'])->name('pending');
        Route::get('/{school}', [AdminSchoolController::class, 'show'])->name('show');
        Route::post('/{school}/approve', [AdminSchoolController::class, 'approve'])->name('approve');
        Route::post('/{school}/reject', [AdminSchoolController::class, 'reject'])->name('reject');
        Route::post('/{school}/suspend', [AdminSchoolController::class, 'suspend'])->name('suspend');
    });

    Route::prefix('inquiries')->name('admin.inquiries.')->group(function () {
        Route::get('/', [InquiryController::class, 'index'])->name('index');
        Route::get('/{inquiry}', [InquiryController::class, 'show'])->name('show');
        Route::put('/{inquiry}', [InquiryController::class, 'update'])->name('update');
        Route::post('/reorder', [InquiryController::class, 'reorder'])->name('reorder');
    });

    Route::prefix('policies')->name('admin.policies.')->group(function () {
        Route::get('/', [PolicyController::class, 'index'])->name('index');
        Route::get('/terms/{term}/edit', [PolicyController::class, 'editTerm'])->name('edit-term');
        Route::put('/terms/{term}', [PolicyController::class, 'updateTerm'])->name('update-term');
        Route::get('/privacy/{policy}/edit', [PolicyController::class, 'editPolicy'])->name('edit-policy');
        Route::put('/privacy/{policy}', [PolicyController::class, 'updatePolicy'])->name('update-policy');
    });

    Route::prefix('account')->name('admin.account.')->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('index');
        Route::put('/profile', [AccountController::class, 'updateProfile'])->name('update-profile');
        Route::put('/password', [AccountController::class, 'updatePassword'])->name('update-password');
        Route::delete('/sessions/{sessionId}', [AccountController::class, 'terminateSession'])->name('terminate-session');
        // Route::post('/two-factor', [AccountController::class, 'enableTwoFactor'])->name('enable-two-factor');
    });
});
