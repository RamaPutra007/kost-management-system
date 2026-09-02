# Kost Management System

Aplikasi manajemen sewa kost (kost-kostan) modern dengan antarmuka pengguna berbasis React dan API menggunakan Laravel 11/13.

## Fitur Utama

### 1. Manajemen Hak Akses (Role-Based)
Aplikasi mendukung 3 level akses pengguna:
- **Owner**: Pemilik Kost (Hak akses penuh terhadap seluruh data).
- **Admin**: Staf pengelola kost (Operasional sehari-hari).
- **Penghuni**: Penyewa kost (Hanya dapat mengakses area pribadi).

### 2. Manajemen Data Inti (Core)
- **Kost & Kamar**: Pendataan inventaris bangunan kost beserta status kamar (Kosong, Terisi, Perbaikan).
- **Penghuni**: Pendataan identitas penghuni yang terintegrasi dengan akses login.
- **Kontrak Sewa**: Manajemen siklus penyewaan dari waktu masuk (Check-in) hingga keluar.

### 3. Keuangan & Operasional
- **Tagihan**: *Generate* tagihan otomatis per bulan beserta sistem denda keterlambatan.
- **Pembayaran**: Konfirmasi dan verifikasi pembayaran dari Penghuni. Validasi otomatis mengubah status Tagihan menjadi Lunas.
- **Pengeluaran**: Pencatatan beban operasional (Listrik, Air, Internet, dll) oleh pengelola.

### 4. Portal Penghuni (Self-Service)
- Area khusus di mana penghuni dapat melihat kamar yang disewanya, daftar tagihan yang harus dibayar, serta fasilitas untuk melaporkan bukti transfer langsung ke sistem pengelola.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Tailwind CSS v4, TanStack React Query, Axios.
- **Backend**: Laravel (PHP 8.5+), MySQL, Eloquent ORM, Sanctum API Authentication.

## Panduan Menjalankan Aplikasi Lokal

### Persyaratan Sistem
- PHP 8.5+
- Node.js & npm (Latest LTS)
- MySQL (atau MariaDB setara)
- Composer

### Menjalankan Backend (Laravel)
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

### Menjalankan Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

Aplikasi dapat diakses melalui browser pada `http://localhost:5173`. Pastikan kredensial yang Anda gunakan valid (contoh pada database seeder).

## Keamanan
- Dilindungi oleh CORS dan *Rate-Limiter* (Throttle: 60 request/menit).
- *Insecure Direct Object Reference* (IDOR) Protection telah diaktifkan untuk menjaga batas akses data lintas pengguna.
- Sanitasi *Mass Assignment* dengan `$request->validate()` yang ketat.

---
Dikembangkan secara iteratif mengikuti siklus integrasi keamanan dan prinsip CI/CD sederhana.
