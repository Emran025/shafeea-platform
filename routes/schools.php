<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Schools\SchoolController;
use App\Http\Controllers\Schools\TeacherController;

Route::prefix('schools')->name('schools.')->group(function () {
    // School management routes
    Route::resource('/', SchoolController::class)->parameters(['' => 'school']);
    Route::get('{school}/analytics', [SchoolController::class, 'analytics'])->name('analytics');
    
    // Resource routes for teachers within schools
    Route::resource('teachers', TeacherController::class);
}); 