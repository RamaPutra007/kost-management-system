<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::whereHas('role', function($q) { $q->where('name', 'Penghuni'); })->first();
$tagihan = App\Models\Tagihan::where('penghuni_id', $user->penghuni->id)->first();

echo "User Penghuni ID: " . $user->penghuni->id . "\n";
echo "Tagihan Penghuni ID: " . $tagihan->penghuni_id . "\n";
echo "Create Policy: " . ($user->can('create', App\Models\Pembayaran::class) ? 'YES' : 'NO') . "\n";
