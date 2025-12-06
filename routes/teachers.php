<?php

use App\Http\Controllers\TeacherApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/teachers/apply', [TeacherApplicationController::class, 'create'])->name('teachers.apply');
Route::post('/teachers/apply', [TeacherApplicationController::class, 'store'])->name('teachers.store');
