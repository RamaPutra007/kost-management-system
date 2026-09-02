<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$dashboardControllerCode = <<<'PHP'
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

        $totalPenghuni = Penghuni::where('status_aktif', true)->count();

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
PHP;

$testCode = <<<'PHP'
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_admin_can_access_dashboard()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/overview');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'overview' => [
                         'total_kamar',
                         'kamar_terisi',
                         'kamar_kosong',
                         'total_penghuni',
                         'pendapatan_bulan_ini',
                         'pengeluaran_bulan_ini',
                         'laba_bersih'
                     ]
                 ]);
    }

    public function test_penghuni_cannot_access_dashboard()
    {
        $response = $this->actingAs($this->penghuni)->getJson('/api/dashboard/overview');
        $response->assertStatus(403);
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'DashboardController') === false) {
    $apiContent .= "\nRoute::middleware('auth:sanctum')->get('/dashboard/overview', [\App\Http\Controllers\DashboardController::class, 'getOverview']);\n";
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/DashboardController.php', $dashboardControllerCode);
updateFile($base . '/tests/Feature/DashboardTest.php', $testCode);

echo "Phase 6 created.\n";
