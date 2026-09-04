<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$fasilitas = \App\Models\Fasilitas::pluck('nama_fasilitas')->toArray();
echo "Existing: " . implode(', ', $fasilitas) . PHP_EOL;

$newFacilities = [
    'AC',
    'Kipas Angin',
    'Kamar Mandi Dalam',
    'Kamar Mandi Luar',
    'Water Heater',
    'Kasur Springbed',
    'Lemari Pakaian',
    'Meja Belajar',
    'Kursi',
    'WiFi',
    'TV',
    'Kulkas',
    'Dapur Mini',
    'Balkon',
    'Jendela Luar',
    'Laundry',
    'Parkir Motor',
    'Parkir Mobil',
    'CCTV'
];

foreach ($newFacilities as $f) {
    \App\Models\Fasilitas::firstOrCreate(['nama_fasilitas' => $f]);
}
echo "Done inserting new facilities." . PHP_EOL;
