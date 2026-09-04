# Kost Management System

Sistem manajemen kost modern yang dibangun menggunakan:
- **Backend:** Laravel 11, MySQL, Sanctum (API Authentication)
- **Frontend:** React, Vite, Tailwind CSS, Shadcn UI

## Arsitektur Deployment

Aplikasi ini menggunakan arsitektur di mana **Frontend** (React) dapat di-build dan dimasukkan ke dalam folder `public` milik **Backend** (Laravel).
Hal ini memungkinkan aplikasi berjalan dalam satu domain saja (Monolith) ataupun dipisah (Decoupled) menggunakan platform terpisah seperti Vercel dan Railway.

## Demo / Deployment (Online)

Jika Anda ingin mendemokan website ini secara publik agar dapat diakses melalui URL:

### Opsi 1: Menggunakan Shared Hosting (cPanel) - Rekomendasi
1. Pindahkan seluruh file di dalam folder `backend` ke server hosting Anda.
2. Build frontend Anda dengan menjalankan perintah `npm run build` di folder `frontend`. Hasil build akan otomatis masuk ke folder `backend/public`.
3. Pindahkan isi folder `backend/public` ke folder `public_html` di cPanel.
4. Sesuaikan file `.env` di cPanel (Koneksi Database `DB_HOST`, `DB_DATABASE`, dll).
5. Buat database MySQL di cPanel, lalu import database.
6. Jalankan migrasi dan seeder: `php artisan migrate:fresh --seed` (jika ada akses terminal) atau import via phpMyAdmin.
7. Jalankan `php artisan storage:link` agar file upload (seperti bukti pembayaran) dapat diakses.

### Opsi 2: Menggunakan Cloud Gratis (Vercel & Railway)
Jika tidak memiliki hosting, gunakan Vercel (untuk Frontend) dan Railway (untuk Backend):
1. **Database:** Buat database MySQL di [Railway.app](https://railway.app).
2. **Backend:** Deploy folder `backend` ke Railway menggunakan GitHub. Konfigurasi `Environment Variables` di Railway menggunakan kredensial database yang baru saja dibuat. Pastikan Anda menjalankan perintah build command `php artisan storage:link` di konfigurasi Railway.
3. **Frontend:** Ubah variabel `VITE_API_URL` di folder `frontend/.env` menjadi URL Railway Anda. Lalu, deploy folder `frontend` menggunakan [Vercel](https://vercel.com). File `vercel.json` sudah disediakan untuk mencegah error 404 pada React Router.

## Akun Demo

Setelah berhasil di-deploy, Anda dapat menggunakan akun berikut untuk mencoba sistem:

- **Owner / Admin**
  - Email: `owner@gmail.com` atau `admin@gmail.com`
  - Password: `password`

- **Penghuni**
  - Email: `penghuni@gmail.com`
  - Password: `password`

> **Catatan Penting:** Harap gunakan kredensial ini hanya untuk keperluan demo. Jangan menggunakan data pribadi atau sensitif saat mendemokan aplikasi.
