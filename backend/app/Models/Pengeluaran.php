<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Pengeluaran extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function kost() { return $this->belongsTo(Kost::class); }
    public function kategori() { return $this->belongsTo(KategoriPengeluaran::class, 'kategori_id'); }
    public function pencatat() { return $this->belongsTo(User::class, 'dicatat_oleh'); }
}