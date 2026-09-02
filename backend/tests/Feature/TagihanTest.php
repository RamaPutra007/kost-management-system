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