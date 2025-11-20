<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\StudentController;
use App\Http\Controllers\Api\V1\ApplicantController;
use App\Http\Controllers\Api\V1\SyncController;
use App\Http\Controllers\Api\V1\HalaqaController;
use App\Http\Controllers\Api\V1\TeacherApplicantController;
use App\Http\Controllers\Api\V1\TeacherController;
use App\Http\Controllers\Api\V1\FollowUpController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\SessionController;
use App\Http\Controllers\Api\V1\AccountController;
// Public routes
Route::prefix('v1')->group(function() {
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('password.email');
    });
});


// Protected routes
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::prefix('auth')->name('auth.')->group(function () {
        Route::post('refresh', [AuthController::class, 'refresh'])->name('refresh');
        Route::get('me', [AuthController::class, 'me'])->name('me');
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    });

    // Students routes with prefix 'students' and name prefix 'students.'
    Route::prefix('students')->name('students.')->group(function () {
        Route::get('/', [StudentController::class, 'index'])->name('index');
        Route::get('{id}', [StudentController::class, 'show'])->name('show');
        Route::put('{id}', [StudentController::class, 'update'])->name('update');

        Route::get('{id}/follow-up', [StudentController::class, 'followUp'])->name('followup.get');
        Route::put('{id}/follow-up', [StudentController::class, 'updateFollowUp'])->name('followup.update');

        Route::post('{id}/assign', [StudentController::class, 'assign'])->name('assign');

        Route::post('{id}/actions', [StudentController::class, 'action'])->name('actions');

        // Plan management
        Route::get('{id}/plans', [StudentController::class, 'getPlans'])->name('plans.list');
        Route::get('{id}/plans/active', [StudentController::class, 'getActivePlan'])->name('plans.active');
        Route::post('{id}/plans', [StudentController::class, 'createPlan'])->name('plans.create');
        Route::put('plans/{planId}', [StudentController::class, 'updatePlan'])->name('plans.update');
        Route::delete('plans/{planId}', [StudentController::class, 'deletePlan'])->name('plans.delete');

        // Tracking management
        Route::get('{id}/trackings', [StudentController::class, 'getTrackingsForStudent'])->name('trackings.list');
        Route::post('plans/{planId}/trackings', [StudentController::class, 'createTracking'])->name('trackings.create');
        Route::put('trackings/{trackingId}', [StudentController::class, 'updateTracking'])->name('trackings.update');
        Route::delete('trackings/{trackingId}', [StudentController::class, 'deleteTracking'])->name('trackings.delete');
        Route::get('trackings/{trackingId}/details', [StudentController::class, 'getTrackingDetails'])->name('trackings.details.list');
        Route::post('trackings/{trackingId}/details', [StudentController::class, 'addTrackingDetail'])->name('trackings.details.create');
        Route::delete('tracking-details/{trackingDetailId}', [StudentController::class, 'deleteTrackingDetail'])->name('trackings.details.delete');
    });


    // Applicants routes with name prefix 'students.applicants.'
    Route::prefix('students/applicants')->name('students.applicants.')->group(function () {
        Route::get('/', [ApplicantController::class, 'index'])->name('index');
        Route::get('{id}', [ApplicantController::class, 'show'])->name('show');
        Route::post('{id}/actions', [ApplicantController::class, 'takeAction'])->name('actions');
        Route::post('/', [ApplicantController::class, 'store'])->name('store');
    });
    // halqa routes with name prefix 'halaqas.'
    Route::prefix('halaqas')->name('halaqas.')->group(function () {
        Route::get('/', [HalaqaController::class, 'index'])->name('index');
        Route::post('/', [HalaqaController::class, 'store'])->name('store');
        Route::get('{id}', [HalaqaController::class, 'show'])->name('show');
        Route::put('{id}', [HalaqaController::class, 'update'])->name('update');

        Route::post('{id}/assign-students', [HalaqaController::class, 'assignStudents'])->name('assign-students');
        Route::post('{id}/assign-teacher', [HalaqaController::class, 'assignTeacher'])->name('assign-teacher');

        Route::get('{id}/teachers/history', [HalaqaController::class, 'teachersHistory'])->name('teachers.history');

        Route::get('{id}/students/khatm', [HalaqaController::class, 'studentsKhatm'])->name('students.khatm');
        Route::get('{id}/students', [HalaqaController::class, 'studentsHistory'])->name('students.history');
    });


    Route::prefix('teachers')->name('teachers.')->group(function () {
        Route::get('/', [TeacherController::class, 'index'])->name('index');
        Route::post('/', [TeacherController::class, 'store'])->name('store');
        Route::get('{id}', [TeacherController::class, 'show'])->name('show');
        Route::put('{id}', [TeacherController::class, 'update'])->name('update');

        Route::post('{id}/halaqas', [TeacherController::class, 'assignHalaqas'])->name('assign-halaqas');
        Route::get('{id}/halaqas', [TeacherController::class, 'listHalaqas'])->name('halaqas.list');

        // Applicants routes under /teachers/applicants
        Route::prefix('applicants')->name('applicants.')->group(function () {
            Route::get('/', [TeacherApplicantController::class, 'index'])->name('index');
            Route::get('{id}', [TeacherApplicantController::class, 'show'])->name('show');
            Route::post('{id}/actions', [TeacherApplicantController::class, 'takeAction'])->name('actions');
            Route::post('/', [TeacherApplicantController::class, 'store'])->name('store');
        });
    });
    // Follow-ups routes grouped with prefix and name prefix
    Route::prefix('follow-ups')->name('followups.')->group(function () {
        Route::get('students', [FollowUpController::class, 'studentReports'])->name('students');
        Route::get('halaqas', [FollowUpController::class, 'halaqaReports'])->name('halaqas');
    });

    // Sync routes with name prefix 'sync.'
    Route::prefix('sync')->name('sync.')->group(function () {
        Route::get('students', [SyncController::class, 'syncStudents'])->name('students');
        Route::get('teachers', [SyncController::class, 'syncTeachers'])->name('teachers');
        Route::get('halaqas', [SyncController::class, 'syncHalaqas'])->name('halaqas');
        Route::get('reports', [SyncController::class, 'syncReports'])->name('reports');
    });

    Route::prefix('account')->name('account.')->middleware('auth:sanctum')->group(function () {
        // Get the authenticated user's profile
        Route::get('profile', [AccountController::class, 'getProfile'])->name('profile');
        // List all active login sessions for the current user
        Route::get('sessions', [SessionController::class, 'listSessions'])->name('sessions.list');
        // Refresh the current session token
        Route::post('sessions/refresh', [SessionController::class, 'refreshSession'])->name('sessions.refresh');
        // Terminate all other login sessions except the current one
        Route::post('sessions/terminate-all', [SessionController::class, 'terminateAllOtherSessions'])->name('sessions.terminateAll');
        // Terminate a specific login session by ID
        Route::delete('sessions/{id}', [SessionController::class, 'terminateSession'])->name('sessions.terminate');
    });
});

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

// Route::get('/', function () {
//     return "saher0";
// });
