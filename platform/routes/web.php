
use App\Http\Controllers\Public\DocsController;

// Public Documentation Routes
Route::get('/docs', [DocsController::class, 'index'])->name('docs.index');
Route::get('/docs/{path}', [DocsController::class, 'show'])->where('path', '.*')->name('docs.show');
