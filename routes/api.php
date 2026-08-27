
use App\Http\Controllers\Api\CallSessionController;
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/call-sessions', [CallSessionController::class, 'requestSession']);
    Route::put('/call-sessions/{sessionId}/status', [CallSessionController::class, 'updateStatus']);
    Route::post('/call-sessions/{sessionId}/signal', [CallSessionController::class, 'signal']);
});
