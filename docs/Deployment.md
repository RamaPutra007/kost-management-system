# Deployment Guide

## 1. Architecture Overview
- **Frontend**: Di-build menjadi static files (HTML/CSS/JS) dan dihosting via CDN/Static Hosting.
- **Backend**: Di-host pada server berbasis Linux (Ubuntu) dengan Nginx dan PHP-FPM.
- **Database**: Managed MySQL service atau self-hosted pada server backend.
- **Storage**: Menggunakan local storage tersambung (symlink) atau S3 (opsional).

## 2. Frontend Deployment
1. Jalankan instalasi dependency: `npm install`.
2. Setup variabel environment pada `.env.production` (Vite, contoh: `VITE_API_URL=https://api.domain.com/v1`).
3. Build project: `npm run build`.
4. Unggah isi folder `dist` ke server hosting (seperti Vercel, Netlify, atau direktori root Nginx).

## 3. Backend Deployment (Laravel)
1. Clone repositori ke server production.
2. Jalankan `composer install --optimize-autoloader --no-dev`.
3. Salin `.env.example` menjadi `.env` dan konfigurasikan.
4. Generate application key: `php artisan key:generate`.
5. Setup database, jalankan migrasi & seeder: `php artisan migrate --force`.
6. Buat storage link: `php artisan storage:link`.

## 4. Environment Variables (Backend .env)
Pastikan hal berikut disesuaikan:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.domain.com
FRONTEND_URL=https://app.domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kost_db
DB_USERNAME=kost_user
DB_PASSWORD=secret

SESSION_DOMAIN=.domain.com
SANCTUM_STATEFUL_DOMAINS=app.domain.com
CORS_ALLOWED_ORIGINS=https://app.domain.com
```

## 5. Caching & Optimization
Jalankan perintah optimasi pada Laravel untuk performa terbaik:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache
```

## 6. Queue
- Jika ada tugas background (notifikasi/email), konfigurasikan `QUEUE_CONNECTION=redis` atau `database`.
- Jalankan worker daemon menggunakan Supervisor: `php artisan queue:work`.

## 7. Storage
- Pastikan folder `storage/app/public` memiliki hak akses tulis (write permissions) untuk web server user (seperti `www-data`).
- Symlink dibuat sehingga file bisa diakses via `public/storage`.

## 8. Backup & Logging
- Log error disimpan di `storage/logs/laravel.log`.
- Setup cron job untuk backup database menggunakan tool seperti `spatie/laravel-backup` (opsional).

## 9. HTTPS
- Install sertifikat SSL (contoh: Let's Encrypt / Certbot) untuk domain API dan Frontend.
- Arahkan konfigurasi Nginx agar secara paksa mengalihkan traffic HTTP ke HTTPS.

## 10. Production Checklist
- [ ] `APP_DEBUG` diset `false`.
- [ ] Environment production `.env` sudah aman.
- [ ] Route, config, dan view sudah di-cache.
- [ ] Database credentials menggunakan user yang memiliki izin minimal.
- [ ] SSL terpasang dan berfungsi.
- [ ] Storage symlink berhasil dibuat.
- [ ] CORS terkonfigurasi untuk membatasi origin.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[API]], [[Roadmap]]
- [[Security]], [[Testing]], [[User-Flow]]
