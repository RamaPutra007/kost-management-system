<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$pembayaranControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Pembayaran;
use App\Models\Tagihan;
use Illuminate\Http\Request;

class PembayaranController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(Pembayaran::with(['penghuni', 'tagihan'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }

        $this->authorize('viewAny', Pembayaran::class);
        return response()->json(Pembayaran::with(['penghuni', 'tagihan'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Pembayaran::class);

        $validated = $request->validate([
            'tagihan_id' => 'required|exists:tagihans,id',
            'nominal_bayar' => 'required|numeric',
            'metode_pembayaran' => 'required|string',
            'bukti_pembayaran' => 'nullable|string',
            'tanggal_bayar' => 'required|date',
            'status' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        $tagihan = Tagihan::findOrFail($validated['tagihan_id']);
        
        // Ensure user is the owner of the tagihan if they are a Penghuni
        if ($request->user()->role->name === 'Penghuni' && $tagihan->penghuni_id !== $request->user()->penghuni->id) {
            abort(403, 'Unauthorized');
        }

        $validated['penghuni_id'] = $tagihan->penghuni_id;
        $validated['status'] = $request->user()->role->name === 'Penghuni' ? 'Pending' : ($validated['status'] ?? 'Valid');

        $pembayaran = Pembayaran::create($validated);

        // Auto update tagihan if Valid
        if ($validated['status'] === 'Valid') {
            $tagihan->update(['status' => 'Lunas']);
        }

        return response()->json($pembayaran, 201);
    }

    public function show(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('view', $pembayaran);
        return response()->json($pembayaran->load(['penghuni', 'tagihan']));
    }

    public function update(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('update', $pembayaran);

        $validated = $request->validate([
            'nominal_bayar' => 'sometimes|numeric',
            'metode_pembayaran' => 'sometimes|string',
            'bukti_pembayaran' => 'nullable|string',
            'status' => 'sometimes|in:Pending,Valid,Invalid',
        ]);

        $pembayaran->update($validated);

        if (isset($validated['status']) && $validated['status'] === 'Valid') {
            $pembayaran->tagihan->update(['status' => 'Lunas']);
        }

        return response()->json($pembayaran);
    }

    public function destroy(Request $request, Pembayaran $pembayaran)
    {
        $this->authorize('delete', $pembayaran);
        $pembayaran->delete();
        return response()->json(null, 204);
    }
}
PHP;

$testCode = <<<'PHP'
<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use Database\Seeders\DatabaseSeeder;

class PembayaranTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_penghuni_can_submit_pembayaran()
    {
        $penghuniModel = $this->penghuni->penghuni;
        $tagihan = Tagihan::where('penghuni_id', $penghuniModel->id)->first();

        $response = $this->actingAs($this->penghuni)->postJson('/api/pembayaran', [
            'tagihan_id' => $tagihan->id,
            'nominal_bayar' => 1500000,
            'metode_pembayaran' => 'Transfer Bank',
            'tanggal_bayar' => date('Y-m-d')
        ]);
        
        $response->assertStatus(201)
                 ->assertJsonPath('status', 'Pending');
    }

    public function test_admin_can_verify_pembayaran()
    {
        $penghuniModel = $this->penghuni->penghuni;
        $tagihan = Tagihan::where('penghuni_id', $penghuniModel->id)->first();

        $pembayaran = Pembayaran::create([
            'penghuni_id' => $penghuniModel->id,
            'tagihan_id' => $tagihan->id,
            'nominal_bayar' => 1500000,
            'metode_pembayaran' => 'Transfer Bank',
            'tanggal_bayar' => date('Y-m-d'),
            'status' => 'Pending'
        ]);

        $response = $this->actingAs($this->admin)->putJson('/api/pembayaran/' . $pembayaran->id, [
            'status' => 'Valid'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('status', 'Valid');

        $tagihan->refresh();
        $this->assertEquals('Lunas', $tagihan->status);
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'PembayaranController') === false) {
    $apiContent = str_replace(
        "Route::apiResource('tagihan', \App\Http\Controllers\TagihanController::class);", 
        "Route::apiResource('tagihan', \App\Http\Controllers\TagihanController::class);\n    Route::apiResource('pembayaran', \App\Http\Controllers\PembayaranController::class);", 
        $apiContent
    );
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/PembayaranController.php', $pembayaranControllerCode);
updateFile($base . '/tests/Feature/PembayaranTest.php', $testCode);

echo "Phase 4 created.\n";
