<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Kost;
use App\Models\Kamar;
use App\Models\Penghuni;
use App\Models\KontrakSewa;
use App\Models\Fasilitas;
use App\Models\PaymentMethod;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roleOwner = Role::create(['name' => 'Owner']);
        $roleAdmin = Role::create(['name' => 'Admin']);
        $rolePenghuni = Role::create(['name' => 'Penghuni']);

        $owner = User::create([
            'name' => 'Owner Kost',
            'email' => 'owner@gmail.com',
            'password' => Hash::make('password'),
            'role_id' => $roleOwner->id,
        ]);

        $admin = User::create([
            'name' => 'Admin Kost',
            'email' => 'admin@gmail.com',
            'password' => Hash::make('password'),
            'role_id' => $roleAdmin->id,
        ]);

        $penghuniUser = User::create([
            'name' => 'John Doe',
            'email' => 'penghuni@gmail.com',
            'password' => Hash::make('password'),
            'role_id' => $rolePenghuni->id,
        ]);

        $kost = Kost::create([
            'nama' => 'Kost Sejahtera',
            'alamat' => 'Jl. Kebon Jeruk No. 1',
            'fasilitas_umum' => 'WiFi, Dapur, Parkir',
        ]);

        $kamar = Kamar::create([
            'kost_id' => $kost->id,
            'nomor_kamar' => 'A1',
            'tipe' => 'VIP',
            'harga' => 1500000,
            'status' => 'Kosong',
        ]);

        $f1 = Fasilitas::create(['nama_fasilitas' => 'AC', 'icon' => 'AirVent']);
        $f2 = Fasilitas::create(['nama_fasilitas' => 'Kamar Mandi Dalam', 'icon' => 'ShowerHead']);
        $f3 = Fasilitas::create(['nama_fasilitas' => 'Water Heater', 'icon' => 'Thermometer']);
        
        $kamar->fasilitas()->sync([$f1->id, $f2->id]);

        $penghuni = Penghuni::create([
            'user_id' => $penghuniUser->id,
            'nik' => '1234567890123456',
            'telepon' => '081234567890',
            'kontak_darurat' => '081234567891',
        ]);

        // Creating KontrakSewa will trigger the observer to update Kamar status to Terisi
        $kontrak = KontrakSewa::create([
            'kamar_id' => $kamar->id,
            'penghuni_id' => $penghuni->id,
            'tanggal_mulai' => date('Y-m-d'),
            'tanggal_selesai' => date('Y-m-d', strtotime('+1 month')),
            'harga_kesepakatan' => 1500000,
            'status' => 'Aktif',
        ]);

        PaymentMethod::create([
            'kost_id' => $kost->id,
            'tipe' => 'Bank',
            'nama_provider' => 'BCA',
            'nomor_rekening' => '1234567890',
            'atas_nama' => 'KOSTKU',
            'is_active' => true,
        ]);

        PaymentMethod::create([
            'kost_id' => $kost->id,
            'tipe' => 'QRIS',
            'nama_provider' => 'QRIS KOSTKU',
            'instruksi' => 'Gopay, OVO, Dana, ShopeePay',
            'is_active' => true,
        ]);
    }
}