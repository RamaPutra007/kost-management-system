# Security Guidelines

## 1. Authentication
- Menggunakan Laravel Sanctum untuk SPA authentication (cookie-based) atau API token-based.
- Implementasi session timeout dan pembatasan jumlah percobaan login yang gagal (Throttling).

## 2. Authorization, Policy & IDOR
- Menerapkan Role-Based Access Control (RBAC) di tingkat route menggunakan middleware.
- Menerapkan Laravel Policy untuk validasi tingkat data (contoh: Penghuni hanya bisa melihat datanya sendiri).
- **IDOR (Insecure Direct Object Reference) Protection**: Controller secara eksplisit memverifikasi kepemilikan data (seperti `penghuni_id`) terhadap `$request->user()->penghuni->id` sebelum menampilkan detail atau memproses perubahan (Update/Delete) pada objek (seperti Tagihan dan Pembayaran).

## 3. Middleware
- Menerapkan middleware untuk seluruh route yang bersifat private.
- Menerapkan middleware role khusus (`role:admin`, `role:owner`) untuk endpoint yang membutuhkan hak akses ekstra.

## 4. Validation & Mass Assignment
- Menggunakan Form Requests untuk memvalidasi semua input data yang masuk.
- Mencegah *mass assignment vulnerability* dengan mendefinisikan `$fillable` atau `$guarded` pada model Eloquent secara ketat.

## 5. Rate Limiting (Throttle)
- Menerapkan rate limiting pada seluruh endpoint API (khususnya untuk mencegah *brute-force* dan DDoS).
- Default limit API telah dikonfigurasi melalui middleware `throttle:60,1` (Maksimal 60 request per menit).

## 6. CORS & CSRF
- **CORS**: Mengonfigurasi `config/cors.php` untuk hanya mengizinkan permintaan dari domain frontend yang valid.
- **CSRF**: Menggunakan proteksi CSRF bawaan Laravel (cookie `XSRF-TOKEN`) untuk aplikasi SPA.

## 7. XSS & SQL Injection
- **XSS**: Seluruh output data di frontend React akan otomatis di-escape. Input HTML akan dinetralkan.
- **SQL Injection**: Seluruh query database harus menggunakan Eloquent ORM atau Query Builder yang memanfaatkan PDO parameter binding.

## 8. File Upload
- Validasi ekstensi dan MIME types secara ketat pada server (`mimes:jpg,png,pdf`).
- Membatasi ukuran maksimal file (contoh: 2MB).
- Menyimpan file yang diunggah ke direktori `storage` yang tidak dapat dieksekusi secara publik, lalu disajikan lewat URL sementara jika file tersebut sensitif.

## 9. Password Security
- Passwords harus memiliki kompleksitas minimum (min 8 karakter, kombinasi huruf dan angka).
- Disimpan di database menggunakan algoritma hashing standar Laravel (Bcrypt/Argon2).

## 10. Secrets & Environment
- File `.env` tidak boleh di-commit ke Git (`.gitignore`).
- Semua credential database, API keys, dan token harus di-inject via environment variables server produksi.

## 11. Logging & HTTPS
- Mencatat aktivitas user kritis (login berhasil/gagal, penghapusan data) di sistem logging aplikasi.
- **HTTPS**: Seluruh komunikasi antara client dan server wajib menggunakan TLS/SSL pada lingkungan production.

## 12. Backup & Data Privacy
- Database dicadangkan secara berkala (cron job).
- Menjaga kerahasiaan data pribadi penghuni sesuai kebijakan privasi lokal.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[API]], [[Deployment]]
- [[Roadmap]], [[Testing]], [[User-Flow]]
