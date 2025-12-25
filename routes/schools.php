<?php

use App\Http\Controllers\SchoolApplicationController;
use Illuminate\Support\Facades\Route;

Route::group(['prefix' => 'register', 'as' => 'register.'], function() {
    Route::get('/', [SchoolApplicationController::class, 'create'])->name('index');
    Route::post('/validate-school', [SchoolApplicationController::class, 'validateSchool'])->name('validate');
    Route::get('/select-subscription-plan', [SchoolApplicationController::class, 'selectSubscriptionPlan'])->name('select-subscription-plan');
    Route::post('/checkout', [SchoolApplicationController::class, 'checkout'])->name('checkout');
});

Route::get('/schools/apply', [SchoolApplicationController::class, 'create'])->name('schools.apply');
Route::post('/schools/apply', [SchoolApplicationController::class, 'store'])->name('schools.store.apply');
