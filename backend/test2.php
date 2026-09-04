<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$v = validator(['email' => ''], ['email' => 'nullable|email']);
echo $v->fails() ? 'FAILS' : 'PASS';
