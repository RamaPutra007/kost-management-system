<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@gmail.com')->first();
        $this->penghuni = User::where('email', 'penghuni@gmail.com')->first();
    }

    public function test_admin_can_access_dashboard()
    {
        $response = $this->actingAs($this->admin)->getJson('/api/dashboard/overview');
        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'overview' => [
                         'total_kamar',
                         'kamar_terisi',
                         'kamar_kosong',
                         'total_penghuni',
                         'pendapatan_bulan_ini',
                         'pengeluaran_bulan_ini',
                         'laba_bersih'
                     ]
                 ]);
    }

    public function test_penghuni_cannot_access_dashboard()
    {
        $response = $this->actingAs($this->penghuni)->getJson('/api/dashboard/overview');
        $response->assertStatus(403);
    }
}