<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$pengeluaranControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use App\Models\KategoriPengeluaran;
use Illuminate\Http\Request;

class PengeluaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json(Pengeluaran::with(['kategori', 'pencatat'])->paginate(15));
    }

    public function store(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'kategori_id' => 'required|exists:kategori_pengeluarans,id',
            'tanggal' => 'required|date',
            'nominal' => 'required|numeric',
            'keterangan' => 'nullable|string',
            'bukti_struk' => 'nullable|string',
        ]);

        $validated['dicatat_oleh'] = $request->user()->id;

        $pengeluaran = Pengeluaran::create($validated);
        return response()->json($pengeluaran, 201);
    }

    public function show(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json($pengeluaran->load(['kategori', 'pencatat']));
    }

    public function update(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'kategori_id' => 'sometimes|exists:kategori_pengeluarans,id',
            'tanggal' => 'sometimes|date',
            'nominal' => 'sometimes|numeric',
            'keterangan' => 'nullable|string',
            'bukti_struk' => 'nullable|string',
        ]);

        $pengeluaran->update($validated);
        return response()->json($pengeluaran);
    }

    public function destroy(Request $request, Pengeluaran $pengeluaran)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $pengeluaran->delete();
        return response()->json(null, 204);
    }
}
PHP;

$kategoriControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\KategoriPengeluaran;
use Illuminate\Http\Request;

class KategoriPengeluaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        return response()->json(KategoriPengeluaran::all());
    }

    public function store(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100',
            'deskripsi' => 'nullable|string',
        ]);

        $kategori = KategoriPengeluaran::create($validated);
        return response()->json($kategori, 201);
    }
}
PHP;

$testCode = <<<'PHP'
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\KategoriPengeluaran;
use Database\Seeders\DatabaseSeeder;

class PengeluaranTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_admin_can_create_kategori_and_pengeluaran()
    {
        $responseKategori = $this->actingAs($this->admin)->postJson('/api/kategori_pengeluaran', [
            'nama_kategori' => 'Listrik',
            'deskripsi' => 'Tagihan Listrik Bulanan'
        ]);
        $responseKategori->assertStatus(201);
        $kategori_id = $responseKategori->json('id');

        $response = $this->actingAs($this->admin)->postJson('/api/pengeluaran', [
            'kategori_id' => $kategori_id,
            'tanggal' => date('Y-m-d'),
            'nominal' => 500000,
            'keterangan' => 'Bayar PLN'
        ]);
        $response->assertStatus(201);
    }

    public function test_penghuni_cannot_access_pengeluaran()
    {
        $response = $this->actingAs($this->penghuni)->getJson('/api/pengeluaran');
        $response->assertStatus(403);
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'PengeluaranController') === false) {
    $apiContent = str_replace(
        "Route::apiResource('pembayaran', \App\Http\Controllers\PembayaranController::class);", 
        "Route::apiResource('pembayaran', \App\Http\Controllers\PembayaranController::class);\n    Route::apiResource('pengeluaran', \App\Http\Controllers\PengeluaranController::class);\n    Route::apiResource('kategori_pengeluaran', \App\Http\Controllers\KategoriPengeluaranController::class);", 
        $apiContent
    );
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/PengeluaranController.php', $pengeluaranControllerCode);
updateFile($base . '/app/Http/Controllers/KategoriPengeluaranController.php', $kategoriControllerCode);
updateFile($base . '/tests/Feature/PengeluaranTest.php', $testCode);

echo "Phase 5 created.\n";
