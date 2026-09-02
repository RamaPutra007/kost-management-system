# Project Roadmap

Roadmap pengembangan sistem Kost Management System, dibagi ke dalam beberapa fase terstruktur.

- **Phase 1 — Project Setup**
  Inisialisasi repositori, setup framework (Laravel & React), konfigurasi environment, dan setup koneksi database.

- **Phase 2 — Authentication**
  Implementasi sistem login, registrasi (jika ada), logout, dan setup Laravel Sanctum untuk manajemen token.

- **Phase 3 — Authorization**
  Penerapan Role-Based Access Control (RBAC) untuk Owner, Admin, dan Penghuni menggunakan Middleware dan Policies.

- **Phase 4 — Database**
  Pembuatan migration, seeder, dan factory untuk seluruh tabel berdasarkan Schema.md.

- **Phase 5 — Kost**
  Pengembangan modul manajemen informasi dasar Kost (Nama, Alamat, Fasilitas Umum).

- **Phase 6 — Kamar**
  Pengembangan fitur CRUD data kamar beserta status ketersediaannya.

- **Phase 7 — Penghuni**
  Pengembangan modul pendataan profil penghuni beserta upload dokumen identitas.

- **Phase 8 — Kontrak**
  Sistem pembuatan, perpanjangan, dan manajemen status kontrak sewa penghuni pada suatu kamar.

- **Phase 9 — Tagihan**
  Implementasi fitur generate tagihan bulanan secara manual maupun sistematis, beserta perhitungan denda.

- **Phase 10 — Pembayaran**
  Pengembangan fitur upload bukti pembayaran oleh penghuni dan sistem verifikasi oleh Admin/Owner.

- **Phase 11 — Pengeluaran**
  Modul pencatatan arus kas keluar (biaya operasional, perbaikan, utilitas).

- **Phase 12 — Dashboard**
  Integrasi data dari seluruh modul untuk disajikan sebagai ringkasan statistik (total kamar, pendapatan, dll).

- **Phase 13 — Laporan**
  Fitur rekapitulasi data keuangan dan ekspor laporan ke format PDF atau Excel.

- **Phase 14 — Notification**
  Implementasi sistem pemberitahuan in-app (contoh: tagihan baru, pembayaran berhasil, kontrak akan habis).

- **Phase 15 — React Frontend**
  Pembuatan antarmuka pengguna (UI) menggunakan React, Tailwind, dan integrasi routing SPA.

- **Phase 16 — API Integration**
  Penyambungan antara UI frontend dengan endpoint REST API backend.

- **Phase 17 — Testing**
  Pelaksanaan Unit, Feature, dan End-to-End testing untuk memastikan sistem berjalan sesuai spesifikasi (bebas bug kritis).

- **Phase 18 — Security**
  Review dan implementasi pengamanan menyeluruh (validasi, proteksi XSS/SQLi, rate limiting, dll).

- **Phase 19 — Deployment**
  Setup server produksi, migrasi data, konfigurasi web server, SSL, dan perilisan ke lingkungan live.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[API]], [[Deployment]]
- [[Security]], [[Testing]], [[User-Flow]]
