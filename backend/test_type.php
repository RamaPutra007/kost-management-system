<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = App\Models\User::whereHas('role', function($q) { $q->where('name', 'Penghuni'); })->first();
$tagihan = App\Models\Tagihan::where('penghuni_id', $user->penghuni->id)->first();

var_dump($tagihan->penghuni_id);
var_dump($user->penghuni->id);
var_dump($tagihan->penghuni_id !== $user->penghuni->id);
