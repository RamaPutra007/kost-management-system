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
        // METRICS TAMBAHAN
        // ==============================

        $tagihanJatuhTempo = Tagihan::whereIn('status', ['Pending', 'Overdue'])
            ->whereDate('jatuh_tempo', '<', Carbon::now())
            ->count();

        $kontrakAkanBerakhir = \App\Models\KontrakSewa::where('status', 'Aktif')
            ->whereDate('tanggal_selesai', '<=', Carbon::now()->addDays(30))
            ->count();

        // ==============================
        // CHART DATA (6 BULAN TERAKHIR)
        // ==============================

        $chartData = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $pendapatan = Tagihan::where('status', 'Lunas')
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->sum('total_tagihan');
                
            $pengeluaran = Pengeluaran::whereMonth('tanggal', $month->month)
                ->whereYear('tanggal', $month->year)
                ->sum('nominal');
                
            $chartData[] = [
                'name' => $month->translatedFormat('M'),
                'pendapatan' => (int)$pendapatan,
                'pengeluaran' => (int)$pengeluaran,
            ];
        }

        // ==============================
        // EXPENSE BREAKDOWN (BULAN INI)
        // ==============================

        $expenseBreakdown = Pengeluaran::whereMonth('tanggal', $bulanIni)
            ->whereYear('tanggal', $tahunIni)
            ->selectRaw('kategori as name, SUM(nominal) as value')
            ->groupBy('kategori')
            ->get();
            
        if ($expenseBreakdown->isEmpty()) {
            $expenseBreakdown = [
                ['name' => 'Belum Ada', 'value' => 0]
            ];
        }

        // ==============================
        // PAYMENT STATUS (BULAN INI)
        // ==============================

        $lunasCount = Tagihan::where('status', 'Lunas')->whereMonth('created_at', $bulanIni)->count();
        $belumLunasCount = Tagihan::whereIn('status', ['Pending', 'Overdue'])->whereMonth('created_at', $bulanIni)->count();
        $totalTagihanCount = $lunasCount + $belumLunasCount;
        
        $lunasPct = $totalTagihanCount > 0 ? round(($lunasCount / $totalTagihanCount) * 100) : 0;
        $belumLunasPct = $totalTagihanCount > 0 ? 100 - $lunasPct : 0;

        $paymentStatusData = [
            ['name' => 'Lunas', 'value' => $lunasPct],
            ['name' => 'Belum Lunas', 'value' => $belumLunasPct],
        ];

        // ==============================
        // RECENT BILLS
        // ==============================

        $recentBills = Tagihan::with(['penghuni.user', 'penghuni.kamar'])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($tagihan) {
                return [
                    'name' => $tagihan->penghuni->user->name ?? 'Unknown',
                    'room' => 'Kamar ' . ($tagihan->penghuni->kamar->nomor_kamar ?? '-'),
                    'amount' => $tagihan->total_tagihan,
                    'status' => $tagihan->status,
                ];
            });

        // ==============================
        // ADMIN SPECIFIC DATA
        // ==============================

        $pembayaranPendingCount = Tagihan::where('status', 'Pending')->count();

        $pendingPayments = Tagihan::with(['penghuni.user', 'penghuni.kamar'])
            ->where('status', 'Pending')
            ->orderBy('updated_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($t) {
                return [
                    'name' => $t->penghuni->user->name ?? 'Unknown',
                    'room' => 'Kamar ' . ($t->penghuni->kamar->nomor_kamar ?? '-'),
                    'amount' => $t->total_tagihan,
                    'date' => $t->updated_at->diffForHumans(),
                ];
            });

        $unpaidBills = Tagihan::with(['penghuni.user', 'penghuni.kamar'])
            ->whereIn('status', ['Pending', 'Overdue'])
            ->whereDate('jatuh_tempo', '<', Carbon::now())
            ->orderBy('jatuh_tempo', 'asc')
            ->take(5)
            ->get()
            ->map(function ($t) {
                $days = Carbon::now()->diffInDays($t->jatuh_tempo);
                return [
                    'name' => $t->penghuni->user->name ?? 'Unknown',
                    'room' => 'Kamar ' . ($t->penghuni->kamar->nomor_kamar ?? '-'),
                    'due' => 'Terlambat ' . $days . ' Hari',
                ];
            });

        $expiringContracts = \App\Models\KontrakSewa::with(['penghuni.user', 'penghuni.kamar'])
            ->where('status', 'Aktif')
            ->whereDate('tanggal_selesai', '<=', Carbon::now()->addDays(30))
            ->orderBy('tanggal_selesai', 'asc')
            ->take(5)
            ->get()
            ->map(function ($c) {
                $days = Carbon::now()->diffInDays($c->tanggal_selesai, false);
                $daysText = $days > 0 ? "H-{$days}" : "Hari Ini";
                return [
                    'name' => $c->penghuni->user->name ?? 'Unknown',
                    'room' => 'Kamar ' . ($c->penghuni->kamar->nomor_kamar ?? '-'),
                    'expire' => $daysText . ' (' . Carbon::parse($c->tanggal_selesai)->translatedFormat('d M Y') . ')',
                ];
            });

        $recentTenants = Penghuni::with(['user', 'kamar', 'kontrakSewas' => function($q){
                $q->orderBy('tanggal_mulai', 'desc');
            }])
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($p) {
                $status = 'Tidak Aktif';
                $dateText = '-';
                if ($p->kontrakSewas->isNotEmpty()) {
                    $kontrak = $p->kontrakSewas->first();
                    $status = $kontrak->status;
                    $dateText = 'Masuk ' . Carbon::parse($kontrak->tanggal_mulai)->translatedFormat('d M Y');
                }
                return [
                    'name' => $p->user->name ?? 'Unknown',
                    'room' => 'Kamar ' . ($p->kamar->nomor_kamar ?? '-'),
                    'status' => $status,
                    'date' => $dateText,
                ];
            });


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
                'tagihan_jatuh_tempo' => $tagihanJatuhTempo,
                'kontrak_akan_berakhir' => $kontrakAkanBerakhir,
                'chart_data' => $chartData,
                'expense_breakdown' => $expenseBreakdown,
                'payment_status' => $paymentStatusData,
                'recent_bills' => $recentBills,
                // Admin specific
                'pembayaran_pending' => $pembayaranPendingCount,
                'pending_payments_list' => $pendingPayments,
                'unpaid_bills_list' => $unpaidBills,
                'expiring_contracts_list' => $expiringContracts,
                'recent_tenants_list' => $recentTenants,
            ],
        ]);
    }
}