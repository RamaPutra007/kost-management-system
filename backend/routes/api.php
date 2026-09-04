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
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\KomplainController;
use App\Http\Controllers\PembayaranController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\KategoriPengeluaranController;
use App\Http\Controllers\FasilitasController;
use App\Http\Controllers\PaymentMethodController;
use App\Http\Controllers\UserController;
use App\Models\Role;

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
    Route::apiResource('komplain', KomplainController::class);
    
    // Kategori Pengeluaran
    Route::apiResource(
        'kategori_pengeluaran',
        KategoriPengeluaranController::class
    );

    // Fasilitas
    Route::apiResource('fasilitas', FasilitasController::class);

    // Paket
    Route::apiResource('paket', \App\Http\Controllers\PaketController::class);

    Route::apiResource('payment_methods', PaymentMethodController::class);

    // Users
    Route::apiResource('users', UserController::class);
    Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword']);

    // Roles (for dropdown)
    Route::get('roles', function () {
        return response()->json(Role::all());
    });

    // Pengumuman
    Route::apiResource('pengumuman', \App\Http\Controllers\PengumumanController::class)->only(['index', 'store', 'destroy']);

    // Notifications
    Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index']);
    Route::put('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead']);
    Route::delete('/notifications/{id}', [\App\Http\Controllers\NotificationController::class, 'destroy']);

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

Route::get('/test-kost', function (Request $request) {
    $req = Request::create('/api/kost/1', 'PUT', [
        'nama' => 'Test',
        'alamat' => 'Test',
        'settings' => ['wifi_aktif' => true],
        'no_telepon' => '',
        'email' => ''
    ]);
    
    $validator = validator($req->all(), [
        'nama' => 'sometimes|string|max:255',
        'alamat' => 'sometimes|string',
        'no_telepon' => 'nullable|string|max:20',
        'email' => 'nullable|email|max:255',
        'fasilitas_umum' => 'nullable|string',
        'settings' => 'nullable|array',
    ]);

    if ($validator->fails()) {
        return response()->json($validator->errors());
    }

    return response()->json($validator->validated());
});