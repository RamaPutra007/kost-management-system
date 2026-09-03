<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KostController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\PenghuniController;
use App\Http\Controllers\KontrakSewaController;
use App\Http\Controllers\TagihanController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\KategoriPengeluaranController;
use App\Http\Controllers\FasilitasController;

Route::post('/login', [AuthController::class, 'login'])
    ->middleware('throttle:60,1')
    ->name('login');

Route::middleware(['auth:sanctum', 'throttle:60,1'])->group(function () {

    // Dashboard
    Route::get('/dashboard/overview', [
        DashboardController::class,
        'getOverview'
    ]);

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Kost
    Route::apiResource('kost', KostController::class);

    // Kamar
    Route::apiResource('kamar', KamarController::class);

    // Penghuni
    Route::apiResource('penghuni', PenghuniController::class);

    // Kontrak Sewa
    Route::apiResource('kontrak_sewa', KontrakSewaController::class);

    // Tagihan
    Route::apiResource('tagihan', TagihanController::class);

    // Pembayaran
    Route::apiResource('pembayaran', PembayaranController::class);

    // Pengeluaran
    Route::apiResource('pengeluaran', PengeluaranController::class);

    // Kategori Pengeluaran
    Route::apiResource(
        'kategori_pengeluaran',
        KategoriPengeluaranController::class
    );

    // Fasilitas
    Route::apiResource('fasilitas', FasilitasController::class);

    // Example resource routes with policy checking
    Route::get('/penghuni/{penghuni}', function (
        Request $request,
        Penghuni $penghuni
    ) {
        if (!$request->user()->can('view', $penghuni)) {
            abort(403, 'Unauthorized');
        }

        return $penghuni;
    });

    Route::get('/tagihan/{tagihan}', function (
        Request $request,
        Tagihan $tagihan
    ) {
        if (!$request->user()->can('view', $tagihan)) {
            abort(403, 'Unauthorized');
        }

        return $tagihan;
    });
});