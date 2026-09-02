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