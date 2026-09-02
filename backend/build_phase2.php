<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$penghuniControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\Penghuni;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class PenghuniController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('viewAny', Penghuni::class);
        return response()->json(Penghuni::with('user')->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Penghuni::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'nik' => 'required|string|size:16|unique:penghunis,nik',
            'telepon' => 'required|string|max:15',
            'kontak_darurat' => 'required|string|max:15',
            'foto_ktp' => 'nullable|string',
        ]);

        $penghuni = DB::transaction(function () use ($validated) {
            $role = Role::where('name', 'Penghuni')->first();
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_id' => $role->id,
            ]);

            return Penghuni::create([
                'user_id' => $user->id,
                'nik' => $validated['nik'],
                'telepon' => $validated['telepon'],
                'kontak_darurat' => $validated['kontak_darurat'],
                'foto_ktp' => $validated['foto_ktp'] ?? null,
            ]);
        });

        return response()->json($penghuni->load('user'), 201);
    }

    public function show(Request $request, Penghuni $penghuni)
    {
        $this->authorize('view', $penghuni);
        return response()->json($penghuni->load('user'));
    }

    public function update(Request $request, Penghuni $penghuni)
    {
        $this->authorize('update', $penghuni);

        $validated = $request->validate([
            'telepon' => 'sometimes|string|max:15',
            'kontak_darurat' => 'sometimes|string|max:15',
            'foto_ktp' => 'nullable|string',
        ]);

        $penghuni->update($validated);
        return response()->json($penghuni);
    }

    public function destroy(Request $request, Penghuni $penghuni)
    {
        $this->authorize('delete', $penghuni);
        $penghuni->delete();
        return response()->json(null, 204);
    }
}
PHP;

$kontrakSewaControllerCode = <<<'PHP'
<?php

namespace App\Http\Controllers;

use App\Models\KontrakSewa;
use App\Models\Kamar;
use Illuminate\Http\Request;

class KontrakSewaController extends Controller
{
    public function index(Request $request)
    {
        if ($request->user()->role->name === 'Penghuni') {
            $penghuni_id = $request->user()->penghuni->id ?? null;
            return response()->json(KontrakSewa::with(['kamar', 'penghuni'])->where('penghuni_id', $penghuni_id)->paginate(15));
        }
        
        $this->authorize('viewAny', KontrakSewa::class);
        return response()->json(KontrakSewa::with(['kamar', 'penghuni'])->paginate(15));
    }

    public function store(Request $request)
    {
        $this->authorize('create', KontrakSewa::class);

        $validated = $request->validate([
            'kamar_id' => 'required|exists:kamars,id',
            'penghuni_id' => 'required|exists:penghunis,id',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after:tanggal_mulai',
            'harga_kesepakatan' => 'required|numeric',
            'deposit' => 'nullable|numeric',
        ]);

        $validated['status'] = 'Aktif';

        try {
            $kontrak = KontrakSewa::create($validated);
            return response()->json($kontrak, 201);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }
    }

    public function show(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('view', $kontrakSewa);
        return response()->json($kontrakSewa->load(['kamar', 'penghuni']));
    }

    public function update(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('update', $kontrakSewa);

        $validated = $request->validate([
            'status' => 'sometimes|in:Aktif,Selesai,Batal',
        ]);

        $kontrakSewa->update($validated);
        return response()->json($kontrakSewa);
    }

    public function destroy(Request $request, KontrakSewa $kontrakSewa)
    {
        $this->authorize('delete', $kontrakSewa);
        $kontrakSewa->delete();
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
use App\Models\Kamar;
use App\Models\Penghuni;
use App\Models\KontrakSewa;
use Database\Seeders\DatabaseSeeder;

class PenghuniKontrakTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
    }

    public function test_admin_can_create_penghuni()
    {
        $response = $this->actingAs($this->admin)->postJson('/api/penghuni', [
            'name' => 'New User',
            'email' => 'newuser@test.com',
            'password' => 'password123',
            'nik' => '9876543210123456',
            'telepon' => '08111111111',
            'kontak_darurat' => '08222222222'
        ]);
        $response->assertStatus(201);
    }

    public function test_admin_can_create_kontrak()
    {
        $penghuni = Penghuni::first();
        $kamar = Kamar::where('status', 'Kosong')->first();
        if(!$kamar) {
             $kamar = Kamar::create([
                 'kost_id' => 1,
                 'nomor_kamar' => 'Z99',
                 'tipe' => 'Standard',
                 'harga' => 1000000,
                 'status' => 'Kosong'
             ]);
        }

        $response = $this->actingAs($this->admin)->postJson('/api/kontrak_sewa', [
            'kamar_id' => $kamar->id,
            'penghuni_id' => $penghuni->id,
            'tanggal_mulai' => '2026-10-01',
            'tanggal_selesai' => '2026-11-01',
            'harga_kesepakatan' => 1200000
        ]);
        $response->assertStatus(201);
        
        $kamar->refresh();
        $this->assertEquals('Terisi', $kamar->status);
    }

    public function test_cannot_create_overlap_kontrak()
    {
        $penghuni = Penghuni::first();
        $kamar = Kamar::where('status', 'Terisi')->first(); // Already has an active kontrak from seeder

        $response = $this->actingAs($this->admin)->postJson('/api/kontrak_sewa', [
            'kamar_id' => $kamar->id,
            'penghuni_id' => $penghuni->id,
            'tanggal_mulai' => '2026-10-01',
            'tanggal_selesai' => '2026-11-01',
            'harga_kesepakatan' => 1200000
        ]);
        $response->assertStatus(422); // Logic exception thrown in model boot
    }
}
PHP;

// Read and append api.php
$apiPath = $base . '/routes/api.php';
$apiContent = file_get_contents($apiPath);

if (strpos($apiContent, 'PenghuniController') === false) {
    $apiContent = str_replace(
        "Route::apiResource('kamar', \App\Http\Controllers\KamarController::class);", 
        "Route::apiResource('kamar', \App\Http\Controllers\KamarController::class);\n    Route::apiResource('penghuni', \App\Http\Controllers\PenghuniController::class);\n    Route::apiResource('kontrak_sewa', \App\Http\Controllers\KontrakSewaController::class);", 
        $apiContent
    );
    updateFile($apiPath, $apiContent);
}

updateFile($base . '/app/Http/Controllers/PenghuniController.php', $penghuniControllerCode);
updateFile($base . '/app/Http/Controllers/KontrakSewaController.php', $kontrakSewaControllerCode);
updateFile($base . '/tests/Feature/PenghuniKontrakTest.php', $testCode);

echo "Phase 2 created.\n";
