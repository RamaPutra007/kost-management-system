<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('komplains', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penghuni_id')->constrained('penghunis');
            $table->foreignId('kamar_id')->nullable()->constrained('kamars')->nullOnDelete();
            $table->string('kategori'); // Kebersihan, Keamanan, Fasilitas, Lainnya
            $table->text('deskripsi');
            $table->string('foto')->nullable();
            $table->string('status')->default('Menunggu'); // Menunggu, Diproses, Selesai
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('komplains');
    }
};
