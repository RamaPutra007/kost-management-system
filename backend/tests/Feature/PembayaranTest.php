<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Tagihan;
use App\Models\Pembayaran;
use Database\Seeders\DatabaseSeeder;

class PembayaranTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        $this->admin = User::where('email', 'admin@test.com')->first();
        $this->penghuni = User::where('email', 'john@test.com')->first();
        
        $penghuniModel = $this->penghuni->penghuni;
        $kontrak = \App\Models\KontrakSewa::where('penghuni_id', $penghuniModel->id)->first();
        if(!$kontrak) {
             $kamar = \App\Models\Kamar::create([
                 'kost_id' => 1,
                 'nomor_kamar' => 'Z100',
                 'tipe' => 'Standard',
                 'harga' => 1000000,
                 'status' => 'Kosong'
             ]);
             $kontrak = \App\Models\KontrakSewa::create([
                 'kamar_id' => $kamar->id,
                 'penghuni_id' => $penghuniModel->id,
                 'tanggal_mulai' => date('Y-m-d'),
                 'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
                 'harga_kesepakatan' => 1000000,
                 'status' => 'Aktif'
             ]);
        }
        
        $this->tagihan = Tagihan::firstOrCreate([
            'penghuni_id' => $penghuniModel->id,
            'kontrak_sewa_id' => $kontrak->id,
            'bulan_tagihan' => '2026-10-01',
            'nominal' => 1500000,
            'jatuh_tempo' => '2026-10-05',
            'total_tagihan' => 1500000,
            'status' => 'Belum Lunas'
        ]);
    }

    public function test_penghuni_can_submit_pembayaran()
    {
        $response = $this->actingAs($this->penghuni)->postJson('/api/pembayaran', [
            'tagihan_id' => $this->tagihan->id,
            'nominal_bayar' => 1500000,
            'metode_pembayaran' => 'Transfer Bank',
            'tanggal_bayar' => date('Y-m-d')
        ]);
        
        $response->assertStatus(201)
                 ->assertJsonPath('status_verifikasi', 'Pending');
    }

    public function test_admin_can_verify_pembayaran()
    {
        $penghuniModel = $this->penghuni->penghuni;
        $tagihan = $this->tagihan;

        $pembayaran = Pembayaran::create([
            'penghuni_id' => $penghuniModel->id,
            'tagihan_id' => $tagihan->id,
            'nominal_bayar' => 1500000,
            'metode_pembayaran' => 'Transfer Bank',
            'tanggal_bayar' => date('Y-m-d'),
            'status_verifikasi' => 'Pending'
        ]);

        $response = $this->actingAs($this->admin)->putJson('/api/pembayaran/' . $pembayaran->id, [
            'status_verifikasi' => 'Valid'
        ]);

        $response->assertStatus(200)
                 ->assertJsonPath('status_verifikasi', 'Valid');

        $tagihan->refresh();
        $this->assertEquals('Lunas', $tagihan->status);
    }
}