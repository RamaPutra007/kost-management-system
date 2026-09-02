<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Pembayaran extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function tagihan() { return $this->belongsTo(Tagihan::class); }
    public function penghuni() { return $this->belongsTo(Penghuni::class); }
    public function verifikator() { return $this->belongsTo(User::class, 'diverifikasi_oleh'); }
}