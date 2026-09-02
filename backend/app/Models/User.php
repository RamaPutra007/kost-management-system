<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable {
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;
    protected $guarded = [];
    protected $hidden = ['password', 'remember_token'];
    protected function casts(): array { return ['email_verified_at' => 'datetime', 'password' => 'hashed']; }
    public function role() { return $this->belongsTo(Role::class); }
    public function penghuni() { return $this->hasOne(Penghuni::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function pembayaranDiverifikasi() { return $this->hasMany(Pembayaran::class, 'diverifikasi_oleh'); }
    public function pengeluaranDicatat() { return $this->hasMany(Pengeluaran::class, 'dicatat_oleh'); }
}