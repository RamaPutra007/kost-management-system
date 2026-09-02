<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('kost', \App\Http\Controllers\KostController::class);
    Route::apiResource('kamar', \App\Http\Controllers\KamarController::class);
    Route::apiResource('penghuni', \App\Http\Controllers\PenghuniController::class);
    Route::apiResource('kontrak_sewa', \App\Http\Controllers\KontrakSewaController::class);
    Route::apiResource('tagihan', \App\Http\Controllers\TagihanController::class);
    Route::apiResource('pembayaran', \App\Http\Controllers\PembayaranController::class);
    Route::apiResource('pengeluaran', \App\Http\Controllers\PengeluaranController::class);
    Route::apiResource('kategori_pengeluaran', \App\Http\Controllers\KategoriPengeluaranController::class);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Example resource routes with policy checking
    Route::get('/penghuni/{penghuni}', function (Request $request, \App\Models\Penghuni $penghuni) {
        $request->user()->can('view', $penghuni) ? abort_if(false, 403) : abort(403, 'Unauthorized');
        return $penghuni;
    });

    Route::get('/tagihan/{tagihan}', function (Request $request, \App\Models\Tagihan $tagihan) {
        $request->user()->can('view', $tagihan) ? abort_if(false, 403) : abort(403, 'Unauthorized');
        return $tagihan;
    });
});
Route::middleware('auth:sanctum')->get('/dashboard/overview', [\App\Http\Controllers\DashboardController::class, 'getOverview']);
