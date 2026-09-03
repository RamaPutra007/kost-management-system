<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use App\Models\Penghuni;
use App\Models\Tagihan;
use App\Models\Pengeluaran;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Get dashboard overview.
     */
    public function getOverview(Request $request)
    {
        $user = $request->user();

        // Seharusnya sudah ditangani oleh auth:sanctum,
        // tetapi tetap aman jika user tidak ditemukan.
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        // Penghuni tidak boleh melihat dashboard admin.
        if ($user->role?->name === 'Penghuni') {
            return response()->json([
                'message' => 'Unauthorized.',
            ], 403);
        }

        // ==============================
        // KAMAR
        // ==============================

        $totalKamar = Kamar::count();

        $kamarTerisi = Kamar::where(
            'status',
            'Terisi'
        )->count();

        $kamarKosong = Kamar::where(
            'status',
            'Kosong'
        )->count();

        // ==============================
        // PENGHUNI
        // ==============================

        $totalPenghuni = Penghuni::whereHas(
            'kontrakSewas',
            function ($query) {
                $query->where(
                    'status',
                    'Aktif'
                );
            }
        )->count();

        // ==============================
        // PERIODE
        // ==============================

        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        // ==============================
        // PENDAPATAN
        // ==============================

        $pendapatanBulanIni = Tagihan::where(
            'status',
            'Lunas'
        )
            ->whereMonth(
                'created_at',
                $bulanIni
            )
            ->whereYear(
                'created_at',
                $tahunIni
            )
            ->sum('total_tagihan');

        // ==============================
        // PENGELUARAN
        // ==============================

        $pengeluaranBulanIni = Pengeluaran::whereMonth(
            'tanggal',
            $bulanIni
        )
            ->whereYear(
                'tanggal',
                $tahunIni
            )
            ->sum('nominal');

        // ==============================
        // LABA BERSIH
        // ==============================

        $labaBersih =
            $pendapatanBulanIni -
            $pengeluaranBulanIni;

        // ==============================
        // RESPONSE
        // ==============================

        return response()->json([
            'overview' => [
                'total_kamar' => $totalKamar,
                'kamar_terisi' => $kamarTerisi,
                'kamar_kosong' => $kamarKosong,
                'total_penghuni' => $totalPenghuni,
                'pendapatan_bulan_ini' => $pendapatanBulanIni,
                'pengeluaran_bulan_ini' => $pengeluaranBulanIni,
                'laba_bersih' => $labaBersih,
            ],
        ]);
    }
}