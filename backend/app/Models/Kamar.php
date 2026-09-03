<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Kamar extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function kost() { return $this->belongsTo(Kost::class); }
    public function kontrakSewas() { return $this->hasMany(KontrakSewa::class); }
    public function fasilitas() { return $this->belongsToMany(Fasilitas::class, 'fasilitas_kamar'); }
}