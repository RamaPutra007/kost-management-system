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