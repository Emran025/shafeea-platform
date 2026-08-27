
use App\Http\Controllers\Api\V1\Certificates\CertificateController;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/certificates/templates', [CertificateController::class, 'storeTemplate']);
    Route::post('/certificates/templates/{template}/generate', [CertificateController::class, 'generateBulk']);
});
Route::get('/verify/cert/{uuid}', [CertificateController::class, 'verify']);

use App\Http\Controllers\Api\V1\Certificates\CertificateBatchController;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/certificates/batch-generate', [CertificateBatchController::class, 'generate']);
    Route::get('/certificates/batch/{batchId}', [CertificateBatchController::class, 'show']);
});
