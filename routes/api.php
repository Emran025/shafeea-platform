<?php\nuse Illuminate\Support\Facades\Route;

// Certificates
Route::middleware('auth:sanctum')->prefix('v1/certificates')->group(function () {
    Route::post('batches', [\App\Http\Controllers\Api\V1\Certificates\CertificateBatchController::class, 'store']);
    Route::get('batches/{id}', [\App\Http\Controllers\Api\V1\Certificates\CertificateBatchController::class, 'show']);
    Route::get('my-certificates', [\App\Http\Controllers\Api\V1\Certificates\StudentCertificateController::class, 'index']);

});
