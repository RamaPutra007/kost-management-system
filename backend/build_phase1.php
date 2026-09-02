<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$kostControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Kost;
use Illuminate\Http\Request;

class KostController extends Controller
{
    public function index()
    {
        return response()->json(Kost::paginate(15));
    }

    public function store(Request $request)
    {
        // Admin or Owner only (authorized by route middleware or logic)
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'alamat' => 'required|string',
            'fasilitas_umum' => 'nullable|string',
        ]);

        $kost = Kost::create($validated);
        return response()->json($kost, 201);
    }

    public function show(Kost $kost)
    {
        return response()->json($kost);
    }

    public function update(Request $request, Kost $kost)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'alamat' => 'sometimes|string',
            'fasilitas_umum' => 'nullable|string',
        ]);

        $kost->update($validated);
        return response()->json($kost);
    }

    public function destroy(Request $request, Kost $kost)
    {
        if ($request->user()->role->name === 'Penghuni') {
            abort(403, 'Unauthorized');
        }

        $kost->delete();
        return response()->json(null, 204);
    }
}
PHP;

$kamarControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Kamar;
use Illuminate\Http\Request;

class KamarController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Kamar::class);
        $query = Kamar::query();
        if ($request->has('kost_id')) {
            $query->where('kost_id', $request->kost_id);
        }
        return response()->json($query->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Kamar::class);

        $validated = $request->validate([
            'kost_id' => 'required|exists:kosts,id',
            'nomor_kamar' => 'required|string|max:50',
            'tipe' => 'required|string|max:100',
            'harga' => 'required|numeric',
            'fasilitas' => 'nullable|string',
            'status' => 'sometimes|in:Kosong,Terisi,Perbaikan',
        ]);

        $kamar = Kamar::create($validated);
        return response()->json($kamar, 201);
    }

    public function show(Request $request, Kamar $kamar)
    {
        $this->authorize('view', $kamar);
        return response()->json($kamar);
    }

    public function update(Request $request, Kamar $kamar)
    {
        $this->authorize('update', $kamar);

        $validated = $request->validate([
            'kost_id' => 'sometimes|exists:kosts,id',
            'nomor_kamar' => 'sometimes|string|max:50',
            'tipe' => 'sometimes|string|max:100',
            'harga' => 'sometimes|numeric',
            'fasilitas' => 'nullable|string',
            'status' => 'sometimes|in:Kosong,Terisi,Perbaikan',
        ]);

        $kamar->update($validated);
        return response()->json($kamar);
    }

    public function destroy(Request $request, Kamar $kamar)
    {
        $this->authorize('delete', $kamar);
        $kamar->delete();
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
use App\Models\Role;
use App\Models\Kost;
use App\Models\Kamar;
use Database\Seeders\DatabaseSeeder;

class KostKamarTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->owner = User::where('email', 'owner@test.com')->first();
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_admin_can_create_kost()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/kost', [
            'nama' => 'Kost Baru',
            'alamat' => 'Alamat Baru'
        ]);
        $response->assertStatus(201);
    }

    public function test_penghuni_cannot_create_kost()
    {
        $response = $this->actingAs($this->penghuni)->postJson('/api/kost', [
            'nama' => 'Kost Baru',
            'alamat' => 'Alamat Baru'
        ]);
        $response->assertStatus(403);
    }

    public function test_admin_can_create_kamar()
    {
        $kost = Kost::first();
        $response = $this->actingAs($this->admin)->postJson('/api/kamar', [
            'kost_id' => $kost->id,
            'nomor_kamar' => 'B1',
            'tipe' => 'Standard',
            'harga' => 1000000
        ]);
        $response->assertStatus(201);
    }

    public function test_penghuni_can_view_kamar()
    {
        $response = $this->actingAs($this->penghuni)->getJson('/api/kamar');
        $response->assertStatus(200);
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'KostController') === false) {
    $apiContent = str_replace(
        'Route::middleware(\'auth:sanctum\')->group(function () {', 
        "Route::middleware('auth:sanctum')->group(function () {\n    Route::apiResource('kost', \App\Http\Controllers\KostController::class);\n    Route::apiResource('kamar', \App\Http\Controllers\KamarController::class);", 
        $apiContent
    );
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/KostController.php', $kostControllerCode);
updateFile($base . '/app/Http/Controllers/KamarController.php', $kamarControllerCode);
updateFile($base . '/tests/Feature/KostKamarTest.php', $testCode);

echo "Phase 1 created.\n";
