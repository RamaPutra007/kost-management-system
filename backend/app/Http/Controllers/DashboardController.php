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
    public function getOverview(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $totalKamar = Kamar::count();
        $kamarTerisi = Kamar::where('status', 'Terisi')->count();
        $kamarKosong = Kamar::where('status', 'Kosong')->count();

        $totalPenghuni = Penghuni::whereHas('kontrakSewas', function ($query) {
            $query->where('status', 'Aktif');
        })->count();

        $bulanIni = Carbon::now()->month;
        $tahunIni = Carbon::now()->year;

        $pendapatanBulanIni = Tagihan::where('status', 'Lunas')
            ->whereMonth('created_at', $bulanIni)
            ->whereYear('created_at', $tahunIni)
            ->sum('total_tagihan');

        $pengeluaranBulanIni = Pengeluaran::whereMonth('tanggal', $bulanIni)
            ->whereYear('tanggal', $tahunIni)
            ->sum('nominal');

        return response()->json([
            'overview' => [
                'total_kamar' => $totalKamar,
                'kamar_terisi' => $kamarTerisi,
                'kamar_kosong' => $kamarKosong,
                'total_penghuni' => $totalPenghuni,
                'pendapatan_bulan_ini' => $pendapatanBulanIni,
                'pengeluaran_bulan_ini' => $pengeluaranBulanIni,
                'laba_bersih' => $pendapatanBulanIni - $pengeluaranBulanIni
            ]
        ]);
    }
}