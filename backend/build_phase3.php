<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$tagihanControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Tagihan;
use Illuminate\Http\Request;

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(Tagihan::with(['penghuni', 'kontrak_sewa'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }

        $this->authorize('viewAny', Tagihan::class);
        return response()->json(Tagihan::with(['penghuni', 'kontrak_sewa'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Tagihan::class);

        $validated = $request->validate([
            'penghuni_id' => 'required|exists:penghunis,id',
            'kontrak_sewa_id' => 'required|exists:kontrak_sewas,id',
            'bulan_tagihan' => 'required|date_format:Y-m-d',
            'nominal' => 'required|numeric',
            'denda' => 'nullable|numeric',
            'jatuh_tempo' => 'required|date',
            'status' => 'sometimes|in:Belum Dibayar,Lunas',
        ]);

        $validated['total_tagihan'] = $validated['nominal'] + ($validated['denda'] ?? 0);
        $validated['status'] = $validated['status'] ?? 'Belum Dibayar';

        $tagihan = Tagihan::create($validated);
        return response()->json($tagihan, 201);
    }

    public function show(Request $request, Tagihan $tagihan)
    {
        $this->authorize('view', $tagihan);
        return response()->json($tagihan->load(['penghuni', 'kontrak_sewa']));
    }

    public function update(Request $request, Tagihan $tagihan)
    {
        $this->authorize('update', $tagihan);

        $validated = $request->validate([
            'nominal' => 'sometimes|numeric',
            'denda' => 'sometimes|numeric',
            'jatuh_tempo' => 'sometimes|date',
            'status' => 'sometimes|in:Belum Dibayar,Lunas',
        ]);

        if (isset($validated['nominal']) || isset($validated['denda'])) {
            $validated['total_tagihan'] = ($validated['nominal'] ?? $tagihan->nominal) + ($validated['denda'] ?? $tagihan->denda);
        }

        $tagihan->update($validated);
        return response()->json($tagihan);
    }

    public function destroy(Request $request, Tagihan $tagihan)
    {
        $this->authorize('delete', $tagihan);
        $tagihan->delete();
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
use Database\Seeders\DatabaseSeeder;

class TagihanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_admin_can_create_tagihan()
    {
        $penghuniModel = $this->penghuni->penghuni;
        $kontrak = \App\Models\KontrakSewa::where('penghuni_id', $penghuniModel->id)->first();

        $response = $this->actingAs($this->admin)->postJson('/api/tagihan', [
            'penghuni_id' => $penghuniModel->id,
            'kontrak_sewa_id' => $kontrak->id,
            'bulan_tagihan' => '2026-10-01',
            'nominal' => 1500000,
            'jatuh_tempo' => '2026-10-05'
        ]);
        $response->assertStatus(201);
    }

    public function test_penghuni_can_view_own_tagihan()
    {
        $response = $this->actingAs($this->penghuni)->getJson('/api/tagihan');
        $response->assertStatus(200);
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'TagihanController') === false) {
    $apiContent = str_replace(
        "Route::apiResource('kontrak_sewa', \App\Http\Controllers\KontrakSewaController::class);", 
        "Route::apiResource('kontrak_sewa', \App\Http\Controllers\KontrakSewaController::class);\n    Route::apiResource('tagihan', \App\Http\Controllers\TagihanController::class);", 
        $apiContent
    );
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/TagihanController.php', $tagihanControllerCode);
updateFile($base . '/tests/Feature/TagihanTest.php', $testCode);

echo "Phase 3 created.\n";
