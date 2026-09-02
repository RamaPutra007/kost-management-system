<?php
$envPath = __DIR__ . '/.env';
$env = file_get_contents($envPath);

// Ubah koneksi ke mysql
$env = preg_replace('/DB_CONNECTION=.*/', 'DB_CONNECTION=mysql', $env);
// Hapus komentar pada DB_HOST dkk dan set valuenya
$env = preg_replace('/# DB_HOST=.*/', 'DB_HOST=127.0.0.1', $env);
$env = preg_replace('/# DB_PORT=.*/', 'DB_PORT=3306', $env);
$env = preg_replace('/# DB_DATABASE=.*/', 'DB_DATABASE=kost_management', $env);
$env = preg_replace('/# DB_USERNAME=.*/', 'DB_USERNAME=root', $env);
$env = preg_replace('/# DB_PASSWORD=.*/', 'DB_PASSWORD=root', $env);

if (strpos($env, 'DB_DATABASE=kost_management') === false) {
    $env = str_replace('DB_CONNECTION=mysql', "DB_CONNECTION=mysql\nDB_HOST=127.0.0.1\nDB_PORT=3306\nDB_DATABASE=kost_management\nDB_USERNAME=root\nDB_PASSWORD=root", $env);
}

file_put_contents($envPath, $env);
echo "Configured .env for MySQL\n";

try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306', 'root', 'root');
    $pdo->exec('CREATE DATABASE IF NOT EXISTS kost_management');
    echo "Database kost_management ensured.\n";
} catch(Exception $e) {
    echo "DB error: " . $e->getMessage();
}
