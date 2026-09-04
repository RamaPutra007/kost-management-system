<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$admin = \App\Models\User::whereHas('role', function($q) { $q->where('name', 'Admin'); })->first();
if (!$admin) {
    echo "No admin found\n";
    exit;
}

$request = \Illuminate\Http\Request::create('/api/pengumuman', 'POST', [
    'title' => 'Test',
    'message' => 'Test message',
    'type' => 'info'
]);
$request->setUserResolver(function() use ($admin) { return $admin; });

$response = app()->handle($request);
echo "Status: " . $response->getStatusCode() . "\n";
echo "Content: " . $response->getContent() . "\n";
