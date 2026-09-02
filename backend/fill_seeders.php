<?php
$base = __DIR__;

function updateFile($file, $content) {
    file_put_contents($file, $content);
    echo "Updated $file\n";
}

$dbSeederCode = <<<'PHP'
<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\User;
use App\Models\Kost;
use App\Models\Kamar;
use App\Models\Penghuni;
use App\Models\KontrakSewa;
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
            'email' => 'owner@test.com',
            'password' => Hash::make('password'),
            'role_id' => $roleOwner->id,
        ]);

        $admin = User::create([
            'name' => 'Admin Kost',
            'email' => 'admin@test.com',
            'password' => Hash::make('password'),
            'role_id' => $roleAdmin->id,
        ]);

        $penghuniUser = User::create([
            'name' => 'John Doe',
            'email' => 'john@test.com',
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
            'fasilitas' => 'AC, Kamar Mandi Dalam',
            'status' => 'Kosong',
        ]);

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
    }
}
PHP;

updateFile($base . '/database/seeders/DatabaseSeeder.php', $dbSeederCode);
echo "Seeders updated.\n";
