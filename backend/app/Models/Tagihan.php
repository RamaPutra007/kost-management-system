<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Tagihan extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function penghuni() { return $this->belongsTo(Penghuni::class); }
    public function kontrakSewa() { return $this->belongsTo(KontrakSewa::class); }
    public function pembayarans() { return $this->hasMany(Pembayaran::class); }
}