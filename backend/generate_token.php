<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$user = \App\Models\User::first();
if (!$user) {
    echo "No user found.\n";
} else {
    $token = $user->createToken('test')->plainTextToken;
    echo "TOKEN=" . $token . "\n";
}
