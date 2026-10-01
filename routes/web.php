<?php

use App\Http\Controllers\ParishSystemController;
use Illuminate\Support\Facades\Route;

Route::get('/', [ParishSystemController::class, 'welcome'])->name('home');
Route::get('/welcome', [ParishSystemController::class, 'welcome'])->name('welcome');
Route::get('/prototype', [ParishSystemController::class, 'index'])->name('prototype');
Route::post('/households', [ParishSystemController::class, 'storeHousehold'])->name('households.store');
Route::post('/households/{household}/review', [ParishSystemController::class, 'reviewHousehold'])->name('households.review');
Route::post('/certificates/request', [ParishSystemController::class, 'requestCertificate'])->name('certificates.request');
Route::post('/certificates/{certificate}/issue', [ParishSystemController::class, 'issueCertificate'])->name('certificates.issue');

// Parish options CRUD (Pastor-managed dropdowns)
Route::post('/parish-options', [ParishSystemController::class, 'storeOption'])->name('options.store');
Route::patch('/parish-options/{parishOption}', [ParishSystemController::class, 'updateOption'])->name('options.update');
Route::delete('/parish-options/{parishOption}', [ParishSystemController::class, 'destroyOption'])->name('options.destroy');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [ParishSystemController::class, 'dashboard'])->name('dashboard');
});

require __DIR__.'/settings.php';
