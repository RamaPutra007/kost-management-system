<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
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