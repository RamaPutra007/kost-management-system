<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::where('email', 'penghuni1@example.com')->first();
echo $user->can('create', App\Models\Pembayaran::class) ? 'YES' : 'NO';
