<?php
$base = __DIR__;

function updateFile($file, $content) {
    file_put_contents($file, $content);
    echo "Updated $file\n";
}

$roleCode = <<<'PHP'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Role extends Model {
    use HasFactory;
    protected $guarded = [];
    public function users() { return $this->hasMany(User::class); }
}
PHP;

$userCode = <<<'PHP'
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
PHP;

$kostCode = <<<'PHP'
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
PHP;

$kamarCode = <<<'PHP'
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
}
PHP;

$penghuniCode = <<<'PHP'
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
}
PHP;

$kontrakSewaCode = <<<'PHP'
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
PHP;

$tagihanCode = <<<'PHP'
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
PHP;

$pembayaranCode = <<<'PHP'
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
PHP;

$kategoriCode = <<<'PHP'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class KategoriPengeluaran extends Model {
    use HasFactory;
    protected $guarded = [];
    public function pengeluarans() { return $this->hasMany(Pengeluaran::class, 'kategori_id'); }
}
PHP;

$pengeluaranCode = <<<'PHP'
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
PHP;

$notifCode = <<<'PHP'
<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Notification extends Model {
    use HasFactory;
    protected $guarded = [];
    public function user() { return $this->belongsTo(User::class); }
}
PHP;

updateFile($base . '/app/Models/Role.php', $roleCode);
updateFile($base . '/app/Models/User.php', $userCode);
updateFile($base . '/app/Models/Kost.php', $kostCode);
updateFile($base . '/app/Models/Kamar.php', $kamarCode);
updateFile($base . '/app/Models/Penghuni.php', $penghuniCode);
updateFile($base . '/app/Models/KontrakSewa.php', $kontrakSewaCode);
updateFile($base . '/app/Models/Tagihan.php', $tagihanCode);
updateFile($base . '/app/Models/Pembayaran.php', $pembayaranCode);
updateFile($base . '/app/Models/KategoriPengeluaran.php', $kategoriCode);
updateFile($base . '/app/Models/Pengeluaran.php', $pengeluaranCode);
updateFile($base . '/app/Models/Notification.php', $notifCode);

echo "Models updated.\n";
