<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Schools\TeacherController;

Route::prefix('schools')->name('schools.')->group(function () {
    // Resource routes for teachers within schools
    Route::resource('teachers', TeacherController::class);
}); 