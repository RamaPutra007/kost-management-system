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