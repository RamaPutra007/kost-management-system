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
            'nama_kategori' => 'Listrik'
        ]);
        $responseKategori->assertStatus(201);
        $kategori_id = $responseKategori->json('id');

        $response = $this->actingAs($this->admin)->postJson('/api/pengeluaran', [
            'kost_id' => 1,
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