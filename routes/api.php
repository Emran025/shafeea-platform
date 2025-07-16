<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\ApplicantController;
use App\Http\Controllers\Api\V1\SyncController;

Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Students routes with name prefix 'students.'
    Route::name('students.')->group(function () {
        Route::get('students', [StudentController::class, 'index'])->name('index');
        Route::get('students/{id}', [StudentController::class, 'show'])->name('show');
        Route::put('students/{id}', [StudentController::class, 'update'])->name('update');

        Route::get('students/{id}/follow-up', [StudentController::class, 'getFollowUp'])->name('followup.get');
        Route::put('students/{id}/follow-up', [StudentController::class, 'updateFollowUp'])->name('followup.update');

        Route::post('students/{id}/assign', [StudentController::class, 'assignToHalaqa'])->name('assign');

        Route::post('students/{id}/actions', [StudentController::class, 'takeAction'])->name('actions');
    });

    // Applicants routes with name prefix 'students.applicants.'
    Route::prefix('students/applicants')->name('students.applicants.')->group(function () {
        Route::get('/', [ApplicantController::class, 'index'])->name('index');
        Route::get('{id}', [ApplicantController::class, 'show'])->name('show');
        Route::post('{id}/actions', [ApplicantController::class, 'takeAction'])->name('actions');
        Route::post('/', [ApplicantController::class, 'store'])->name('store');
    });

    // Sync routes with name prefix 'sync.'
    Route::prefix('sync')->name('sync.')->group(function () {
        Route::get('students', [SyncController::class, 'students'])->name('students');
    });
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/',function(){
    return "saher0";
});