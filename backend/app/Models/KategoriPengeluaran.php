<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class KategoriPengeluaran extends Model {
    use HasFactory;
    protected $guarded = [];
    public function pengeluarans() { return $this->hasMany(Pengeluaran::class, 'kategori_id'); }
}