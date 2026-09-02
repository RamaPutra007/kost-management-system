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
        Schema::create('kontrak_sewas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kamar_id')->constrained('kamars');
            $table->foreignId('penghuni_id')->constrained('penghunis');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->decimal('harga_kesepakatan', 15, 2);
            $table->enum('status', ['Aktif', 'Selesai', 'Batal'])->default('Aktif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kontrak_sewas');
    }
};
