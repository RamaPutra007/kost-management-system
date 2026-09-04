<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pakets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penghuni_id')->constrained('penghunis')->onDelete('cascade');
            $table->string('nama_kurir')->nullable();
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['Menunggu Diambil', 'Sudah Diambil'])->default('Menunggu Diambil');
            $table->dateTime('tanggal_diterima');
            $table->dateTime('tanggal_diambil')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pakets');
    }
};
