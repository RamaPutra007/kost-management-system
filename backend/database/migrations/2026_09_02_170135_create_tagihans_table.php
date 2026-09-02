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
        Schema::create('tagihans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('penghuni_id')->constrained('penghunis');
            $table->foreignId('kontrak_sewa_id')->constrained('kontrak_sewas');
            $table->date('bulan_tagihan');
            $table->decimal('nominal', 15, 2);
            $table->decimal('denda', 15, 2)->default(0);
            $table->decimal('total_tagihan', 15, 2);
            $table->date('jatuh_tempo');
            $table->enum('status', ['Belum Lunas', 'Lunas', 'Cicilan'])->default('Belum Lunas');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tagihans');
    }
};
