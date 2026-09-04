<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // For SQLite, altering enums might not work directly with $table->enum(...)->change().
        // Often, we can just use string instead, or if the DB allows it, raw queries.
        // Let's change the column to string so we can store any status, keeping it flexible.
        // But first, we need to make sure we have doctrine/dbal installed. 
        // A safer way is to just define it as a string.
        Schema::table('tagihans', function (Blueprint $table) {
            $table->string('status')->default('Belum Lunas')->change();
        });
    }

    public function down(): void
    {
        Schema::table('tagihans', function (Blueprint $table) {
            $table->string('status')->default('Belum Lunas')->change();
        });
    }
};
