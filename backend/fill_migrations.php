<?php
$base = __DIR__;

// Helper function to update file contents
function updateFile($pattern, $callback) {
    global $base;
    $files = glob($base . $pattern);
    if(empty($files)) {
        echo "No files found for pattern: $pattern\n";
        return;
    }
    $file = $files[0];
    $content = file_get_contents($file);
    $content = $callback($content);
    file_put_contents($file, $content);
    echo "Updated $file\n";
}

// 1. Rename roles migration to run before users
$rolesMig = glob($base . '/database/migrations/*_create_roles_table.php');
if (!empty($rolesMig)) {
    rename($rolesMig[0], $base . '/database/migrations/0000_01_01_000000_create_roles_table.php');
}

// 2. Update Migrations
// roles
updateFile('/database/migrations/*_create_roles_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->string('name', 50)->unique();\n            \$table->timestamps();", $c);
});

// users
updateFile('/database/migrations/*_create_users_table.php', function($c) {
    // Add role_id and softDeletes
    $c = preg_replace('/\$table->string\(\'password\'\);/', "\$table->string('password');\n            \$table->foreignId('role_id')->constrained('roles');\n            \$table->softDeletes();", $c);
    return $c;
});

// kosts
updateFile('/database/migrations/*_create_kosts_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->string('nama');\n            \$table->text('alamat');\n            \$table->text('fasilitas_umum')->nullable();\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// kamars
updateFile('/database/migrations/*_create_kamars_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('kost_id')->constrained('kosts');\n            \$table->string('nomor_kamar', 50);\n            \$table->string('tipe', 100);\n            \$table->decimal('harga', 15, 2);\n            \$table->text('fasilitas')->nullable();\n            \$table->enum('status', ['Kosong', 'Terisi', 'Perbaikan'])->default('Kosong');\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// penghunis
updateFile('/database/migrations/*_create_penghunis_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('user_id')->constrained('users');\n            \$table->string('nik', 20)->unique();\n            \$table->string('telepon', 20);\n            \$table->string('kontak_darurat', 20);\n            \$table->string('foto_ktp')->nullable();\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// kontrak_sewas
updateFile('/database/migrations/*_create_kontrak_sewas_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('kamar_id')->constrained('kamars');\n            \$table->foreignId('penghuni_id')->constrained('penghunis');\n            \$table->date('tanggal_mulai');\n            \$table->date('tanggal_selesai');\n            \$table->decimal('harga_kesepakatan', 15, 2);\n            \$table->enum('status', ['Aktif', 'Selesai', 'Batal'])->default('Aktif');\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// tagihans
updateFile('/database/migrations/*_create_tagihans_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('penghuni_id')->constrained('penghunis');\n            \$table->foreignId('kontrak_sewa_id')->constrained('kontrak_sewas');\n            \$table->date('bulan_tagihan');\n            \$table->decimal('nominal', 15, 2);\n            \$table->decimal('denda', 15, 2)->default(0);\n            \$table->decimal('total_tagihan', 15, 2);\n            \$table->date('jatuh_tempo');\n            \$table->enum('status', ['Belum Lunas', 'Lunas', 'Cicilan'])->default('Belum Lunas');\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// pembayarans
updateFile('/database/migrations/*_create_pembayarans_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('tagihan_id')->constrained('tagihans');\n            \$table->foreignId('penghuni_id')->constrained('penghunis');\n            \$table->date('tanggal_bayar');\n            \$table->decimal('nominal_bayar', 15, 2);\n            \$table->string('metode_pembayaran', 50);\n            \$table->string('bukti_pembayaran')->nullable();\n            \$table->enum('status_verifikasi', ['Pending', 'Valid', 'Invalid'])->default('Pending');\n            \$table->foreignId('diverifikasi_oleh')->nullable()->constrained('users');\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// kategori_pengeluarans
updateFile('/database/migrations/*_create_kategori_pengeluarans_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->string('nama_kategori', 100)->unique();\n            \$table->timestamps();", $c);
});

// pengeluarans
updateFile('/database/migrations/*_create_pengeluarans_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('kost_id')->constrained('kosts');\n            \$table->foreignId('kategori_id')->constrained('kategori_pengeluarans');\n            \$table->date('tanggal');\n            \$table->decimal('nominal', 15, 2);\n            \$table->text('keterangan')->nullable();\n            \$table->string('bukti_struk')->nullable();\n            \$table->foreignId('dicatat_oleh')->constrained('users');\n            \$table->timestamps();\n            \$table->softDeletes();", $c);
});

// notifications
updateFile('/database/migrations/*_create_notifications_table.php', function($c) {
    return str_replace('$table->timestamps();', "\$table->foreignId('user_id')->constrained('users');\n            \$table->string('title');\n            \$table->text('message');\n            \$table->boolean('is_read')->default(false);\n            \$table->timestamps();", $c);
});

echo "Migrations updated.\n";
