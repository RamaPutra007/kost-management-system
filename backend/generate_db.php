<?php
$backendPath = __DIR__;

// Helper to run commands
function runCmd($cmd) {
    echo "Running: $cmd\n";
    echo shell_exec($cmd) . "\n";
}

// 1. Generate Models, Migrations, Factories, Seeders
$models = [
    'Role', 'Kost', 'Kamar', 'Penghuni', 'KontrakSewa',
    'Tagihan', 'Pembayaran', 'KategoriPengeluaran', 'Pengeluaran', 'Notification'
];

foreach ($models as $m) {
    runCmd("php artisan make:model $m -mfs");
}

// User model already exists, we might need a seeder and factory update, but we will rewrite it anyway.
runCmd("php artisan make:seeder UserSeeder");

echo "Generation done.\n";
