<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
class KontrakSewa extends Model {
    use HasFactory, SoftDeletes;
    protected $guarded = [];
    public function kamar() { return $this->belongsTo(Kamar::class); }
    public function penghuni() { return $this->belongsTo(Penghuni::class); }
    public function tagihans() { return $this->hasMany(Tagihan::class); }

    protected static function boot() {
        parent::boot();
        
        static::creating(function ($kontrak) {
            if ($kontrak->status === 'Aktif') {
                $activeCount = self::where('kamar_id', $kontrak->kamar_id)->where('status', 'Aktif')->count();
                if ($activeCount > 0) {
                    throw new \Exception('Kamar sudah memiliki kontrak aktif.');
                }
            }
        });

        static::updating(function ($kontrak) {
            if ($kontrak->status === 'Aktif' && $kontrak->isDirty('status')) {
                $activeCount = self::where('kamar_id', $kontrak->kamar_id)
                                    ->where('status', 'Aktif')
                                    ->where('id', '!=', $kontrak->id)
                                    ->count();
                if ($activeCount > 0) {
                    throw new \Exception('Kamar sudah memiliki kontrak aktif.');
                }
            }
        });

        $updateKamarStatus = function ($kontrak) {
            $kamar = Kamar::find($kontrak->kamar_id);
            if ($kamar) {
                $hasActive = self::where('kamar_id', $kamar->id)->where('status', 'Aktif')->exists();
                $kamar->update(['status' => $hasActive ? 'Terisi' : 'Kosong']);
            }
        };

        static::saved($updateKamarStatus);
        static::deleted($updateKamarStatus);
    }
}