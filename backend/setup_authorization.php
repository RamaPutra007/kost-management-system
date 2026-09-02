<?php
$base = __DIR__;

function updateFile($file, $content) {
    if (!file_exists(dirname($file))) {
        mkdir(dirname($file), 0777, true);
    }
    file_put_contents($file, $content);
    echo "Created/Updated $file\n";
}

$appServiceProviderCode = <<<'PHP'
<?php
namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::before(function ($user, $ability) {
            if ($user->role && $user->role->name === 'Owner') {
                return true;
            }
        });
    }
}
PHP;

$kamarPolicyCode = <<<'PHP'
<?php
namespace App\Policies;

use App\Models\Kamar;
use App\Models\User;

class KamarPolicy
{
    public function viewAny(User $user) { return true; }
    public function view(User $user, Kamar $kamar) { return true; }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, Kamar $kamar) { return $user->role->name === 'Admin'; }
    public function delete(User $user, Kamar $kamar) { return clone $user->role->name === 'Admin'; }
}
PHP;

$penghuniPolicyCode = <<<'PHP'
<?php
namespace App\Policies;

use App\Models\Penghuni;
use App\Models\User;

class PenghuniPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Penghuni $penghuni) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, Penghuni $penghuni) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $penghuni->id;
    }
    public function delete(User $user, Penghuni $penghuni) { return $user->role->name === 'Admin'; }
}
PHP;

$tagihanPolicyCode = <<<'PHP'
<?php
namespace App\Policies;

use App\Models\Tagihan;
use App\Models\User;

class TagihanPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Tagihan $tagihan) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $tagihan->penghuni_id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, Tagihan $tagihan) { return $user->role->name === 'Admin'; }
    public function delete(User $user, Tagihan $tagihan) { return $user->role->name === 'Admin'; }
}
PHP;

$pembayaranPolicyCode = <<<'PHP'
<?php
namespace App\Policies;

use App\Models\Pembayaran;
use App\Models\User;

class PembayaranPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, Pembayaran $pembayaran) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $pembayaran->penghuni_id;
    }
    public function create(User $user) { 
        return $user->role->name === 'Penghuni' || $user->role->name === 'Admin';
    }
    public function update(User $user, Pembayaran $pembayaran) { return $user->role->name === 'Admin'; }
    public function delete(User $user, Pembayaran $pembayaran) { return $user->role->name === 'Admin'; }
}
PHP;

$kontrakSewaPolicyCode = <<<'PHP'
<?php
namespace App\Policies;

use App\Models\KontrakSewa;
use App\Models\User;

class KontrakSewaPolicy
{
    public function viewAny(User $user) { return $user->role->name === 'Admin'; }
    public function view(User $user, KontrakSewa $kontrakSewa) {
        if ($user->role->name === 'Admin') return true;
        return $user->penghuni && $user->penghuni->id === $kontrakSewa->penghuni_id;
    }
    public function create(User $user) { return $user->role->name === 'Admin'; }
    public function update(User $user, KontrakSewa $kontrakSewa) { return $user->role->name === 'Admin'; }
    public function delete(User $user, KontrakSewa $kontrakSewa) { return $user->role->name === 'Admin'; }
}
PHP;

// Write policies
updateFile($base . '/app/Providers/AppServiceProvider.php', $appServiceProviderCode);
updateFile($base . '/app/Policies/KamarPolicy.php', $kamarPolicyCode);
updateFile($base . '/app/Policies/PenghuniPolicy.php', $penghuniPolicyCode);
updateFile($base . '/app/Policies/TagihanPolicy.php', $tagihanPolicyCode);
updateFile($base . '/app/Policies/PembayaranPolicy.php', $pembayaranPolicyCode);
updateFile($base . '/app/Policies/KontrakSewaPolicy.php', $kontrakSewaPolicyCode);


$apiCode = <<<'PHP'
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
PHP;
updateFile($base . '/routes/api.php', $apiCode);


$testCode = <<<'PHP'
<?php
namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Penghuni;
use App\Models\Tagihan;
use Database\Seeders\DatabaseSeeder;

class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        
        $rolePenghuni = Role::where('name', 'Penghuni')->first();
        
        // Buat Penghuni B
        $userB = User::factory()->create(['role_id' => $rolePenghuni->id]);
        $this->penghuniB = Penghuni::create([
            'user_id' => $userB->id,
            'nik' => '999999999999',
            'telepon' => '0899999999',
            'kontak_darurat' => '0899999998'
        ]);
        
        $this->tagihanB = Tagihan::create([
            'penghuni_id' => $this->penghuniB->id,
            'kontrak_sewa_id' => 1, // dummy
            'bulan_tagihan' => '2026-09-01',
            'nominal' => 1000000,
            'total_tagihan' => 1000000,
            'jatuh_tempo' => '2026-09-10'
        ]);
    }

    public function test_owner_full_access()
    {
        $owner = User::where('email', 'owner@test.com')->first();
        $token = $owner->createToken('auth_token')->plainTextToken;

        $response = $this->getJson("/api/penghuni/{$this->penghuniB->id}", [
            'Authorization' => "Bearer $token"
        ]);
        $response->assertStatus(200);
    }

    public function test_admin_operational_access()
    {
        $admin = User::where('email', 'admin@test.com')->first();
        $token = $admin->createToken('auth_token')->plainTextToken;

        $response = $this->getJson("/api/penghuni/{$this->penghuniB->id}", [
            'Authorization' => "Bearer $token"
        ]);
        $response->assertStatus(200);
    }

    public function test_penghuni_access_own_data()
    {
        $userA = User::where('email', 'john@test.com')->first();
        $token = $userA->createToken('auth_token')->plainTextToken;
        $penghuniA = $userA->penghuni;

        $response = $this->getJson("/api/penghuni/{$penghuniA->id}", [
            'Authorization' => "Bearer $token"
        ]);
        $response->assertStatus(200);
    }

    public function test_penghuni_idor_protection()
    {
        // Penghuni A mencoba akses profil Penghuni B
        $userA = User::where('email', 'john@test.com')->first();
        $token = $userA->createToken('auth_token')->plainTextToken;

        $response = $this->getJson("/api/penghuni/{$this->penghuniB->id}", [
            'Authorization' => "Bearer $token"
        ]);
        $response->assertStatus(403);
        
        // Penghuni A mencoba akses tagihan B
        $response2 = $this->getJson("/api/tagihan/{$this->tagihanB->id}", [
            'Authorization' => "Bearer $token"
        ]);
        $response2->assertStatus(403);
    }
}
PHP;

updateFile($base . '/tests/Feature/AuthorizationTest.php', $testCode);

echo "Authorization setup completed.\n";
