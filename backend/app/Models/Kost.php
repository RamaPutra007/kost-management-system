<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class Kost extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function kamars() { return $this->hasMany(Kamar::class); }
    public function pengeluarans() { return $this->hasMany(Pengeluaran::class); }
}