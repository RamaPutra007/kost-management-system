<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fasilitas extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_fasilitas',
        'icon',
    ];

    public function kamars()
    {
        return $this->belongsToMany(Kamar::class, 'fasilitas_kamar');
    }
}
