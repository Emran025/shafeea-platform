<?php

use App\Http\Controllers\SchoolApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/schools/apply', [SchoolApplicationController::class, 'create'])->name('schools.apply');
Route::post('/schools/apply', [SchoolApplicationController::class, 'store'])->name('schools.store');
