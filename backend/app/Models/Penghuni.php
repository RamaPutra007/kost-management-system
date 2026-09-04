<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Penghuni extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function user() { return $this->belongsTo(User::class); }
    public function kontrakSewas() { return $this->hasMany(KontrakSewa::class); }
    public function tagihans() { return $this->hasMany(Tagihan::class); }
    public function pembayarans() { return $this->hasMany(Pembayaran::class); }
    public function komplains() { return $this->hasMany(Komplain::class); }
    public function pakets() { return $this->hasMany(Paket::class); }
}