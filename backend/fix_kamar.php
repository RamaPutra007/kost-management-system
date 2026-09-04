<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

foreach(\App\Models\Komplain::all() as $k) {
    if(!$k->kamar_id && $k->penghuni) {
        $kontrak = $k->penghuni->kontrakSewas()->where('status','Aktif')->first();
        if($kontrak) {
            $k->kamar_id = $kontrak->kamar_id;
            $k->save();
            echo 'Fixed ' . $k->id . PHP_EOL;
        }
    }
}
