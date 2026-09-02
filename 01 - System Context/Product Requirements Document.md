# Product Requirements Document

## 1. Product Overview
Kost Management System adalah aplikasi manajemen rumah kost yang dirancang untuk membantu pemilik kost (Owner) dan Admin dalam mengelola operasional sehari-hari, termasuk manajemen kamar, penghuni, tagihan, dan pengeluaran. Aplikasi ini juga memungkinkan Penghuni untuk melihat informasi kamar, tagihan, dan melakukan konfirmasi pembayaran.

## 2. Problem Statement
Pengelolaan rumah kost seringkali dilakukan secara manual menggunakan buku catatan atau spreadsheet, yang rentan terhadap kesalahan, kehilangan data, dan kesulitan dalam melacak tagihan yang belum dibayar atau kontrak yang akan berakhir. Selain itu, penghuni sering kesulitan mendapatkan informasi transparan mengenai tagihan mereka.

## 3. Goals
- Digitalisasi proses operasional manajemen kost.
- Mempermudah pemantauan ketersediaan kamar, status tagihan, dan perpanjangan kontrak.
- Menyediakan dashboard informatif untuk memantau performa keuangan (pendapatan dan pengeluaran).
- Memberikan akses transparansi bagi penghuni terkait tagihan dan pembayaran.

## 4. Target Users

### Owner
Pemilik rumah kost yang memiliki akses penuh terhadap seluruh data, termasuk keuangan, laporan, dan manajemen pengguna (Admin dan Penghuni).

### Admin
Staf yang ditugaskan oleh Owner untuk mengelola operasional harian seperti mencatat penghuni baru, membuat tagihan, memverifikasi pembayaran, dan mencatat pengeluaran.

### Penghuni
Penyewa kamar kost yang memiliki akses terbatas untuk melihat informasi kontrak sewa mereka sendiri, tagihan, dan riwayat pembayaran.

## 5. User Stories

### Owner
- Sebagai Owner, saya ingin melihat ringkasan pendapatan dan pengeluaran di dashboard, sehingga saya mengetahui kondisi keuangan kost.
- Sebagai Owner, saya ingin mengelola data Admin, sehingga saya bisa mendelegasikan tugas operasional.
- Sebagai Owner, saya ingin melihat laporan keuangan bulanan, sehingga saya bisa melakukan analisis profitabilitas.

### Admin
- Sebagai Admin, saya ingin mendaftarkan penghuni baru dan kontrak sewanya, sehingga data penghuni tercatat dengan baik.
- Sebagai Admin, saya ingin membuat tagihan bulanan untuk penghuni, sehingga proses penagihan berjalan lancar.
- Sebagai Admin, saya ingin memverifikasi pembayaran yang dilakukan penghuni, sehingga status tagihan menjadi Lunas.
- Sebagai Admin, saya ingin mengubah status kamar, sehingga ketersediaan kamar selalu up-to-date.
- Sebagai Admin, saya ingin mencatat pengeluaran operasional (seperti listrik, air, perbaikan), sehingga seluruh biaya tercatat.

### Penghuni
- Sebagai Penghuni, saya ingin melihat rincian tagihan aktif saya, sehingga saya tahu jumlah yang harus dibayar dan batas waktunya.
- Sebagai Penghuni, saya ingin melihat riwayat pembayaran saya, sehingga saya memiliki bukti pembayaran yang sah.
- Sebagai Penghuni, saya ingin melihat informasi kontrak sewa saya, sehingga saya tahu kapan kontrak akan berakhir.

## 6. Functional Requirements

- **Authentication**: Login, Logout, Reset Password, Role-based Access Control (Owner, Admin, Penghuni).
- **Kost**: Manajemen informasi properti kost (nama, alamat, fasilitas umum).
- **Kamar**: Manajemen data kamar (nomor, tipe, harga, fasilitas, status: Kosong/Terisi).
- **Penghuni**: Manajemen data pribadi penghuni (nama, NIK, kontak, foto KTP).
- **Kontrak Sewa**: Manajemen masa sewa penghuni pada kamar tertentu (tanggal mulai, tanggal selesai, harga kesepakatan, status).
- **Tagihan**: Pembuatan dan manajemen tagihan bulanan atau tagihan lainnya (denda, tambahan fasilitas).
- **Pembayaran**: Pencatatan dan verifikasi pembayaran dari penghuni.
- **Pengeluaran**: Pencatatan biaya operasional kost (listrik, kebersihan, perawatan).
- **Laporan**: Generate laporan pendapatan, pengeluaran, dan tunggakan (PDF/Excel).
- **Notifikasi**: Pemberitahuan tagihan baru, pembayaran berhasil, atau kontrak hampir habis.
- **User Management**: Manajemen akun pengguna, role, dan akses.
- **Dashboard**: Tampilan ringkasan metrik penting (kamar terisi/kosong, pendapatan, tunggakan).

## 7. Non-Functional Requirements

- **Performance**: Waktu respons API maksimal 500ms untuk query standar.
- **Security**: Data sensitif (password) di-hash, perlindungan terhadap SQL Injection & XSS, komunikasi via HTTPS.
- **Scalability**: Arsitektur harus mendukung penambahan jumlah kamar dan properti kost di masa depan.
- **Availability**: Sistem memiliki uptime 99.9%.
- **Maintainability**: Kode menggunakan standar PSR-12, arsitektur yang terstruktur, dan komponen UI yang reusable.
- **Usability**: Antarmuka mudah digunakan dan intuitif bagi pengguna awam.
- **Accessibility**: Mendukung kontras warna yang baik dan navigasi yang jelas.
- **Responsive Design**: Aplikasi dapat diakses dengan baik melalui Desktop, Tablet, dan Smartphone.
- **Reliability**: Data tidak boleh hilang akibat kegagalan sistem, dengan backup berkala.

## 8. Scope

### In Scope
- Manajemen Kamar, Penghuni, Kontrak.
- Modul Keuangan (Tagihan, Pembayaran, Pengeluaran).
- Dashboard & Laporan (PDF).
- Role-based Authentication (Owner, Admin, Penghuni).
- Web-based application (SPA).

### Out of Scope
- Integrasi Payment Gateway otomatis (verifikasi masih manual oleh Admin).
- Aplikasi Mobile Native (Android/iOS).
- Manajemen multi-properti/multi-cabang kost (fokus pada 1 entitas kost terlebih dahulu).

### Future Scope
- Integrasi Payment Gateway (Midtrans/Xendit).
- WhatsApp Notification Gateway.
- Modul booking kamar online oleh calon penghuni.

## 9. Business Rules

- Satu kamar tidak boleh mempunyai dua kontrak aktif.
- Penghuni harus memiliki kontrak aktif untuk menempati kamar.
- Kamar dengan kontrak aktif berstatus Terisi.
- Kamar tanpa kontrak aktif berstatus Kosong.
- Tagihan menjadi Lunas setelah pembayaran diverifikasi.
- Penghuni hanya dapat melihat data miliknya sendiri.
- Hanya Owner dan Admin yang dapat menghapus data (Soft Delete).
- Pembayaran tidak bisa lebih besar dari jumlah tagihan kecuali ada aturan deposit.

## 10. Acceptance Criteria

- **Authentication**: Pengguna berhasil login sesuai role dan diarahkan ke dashboard masing-masing.
- **Kamar**: Admin dapat menambah, mengedit, dan melihat daftar kamar dengan status real-time.
- **Kontrak Sewa**: Admin tidak dapat membuat kontrak baru di kamar yang statusnya masih 'Terisi'.
- **Tagihan**: Tagihan ter-generate dengan nominal yang sesuai dengan kontrak.
- **Pembayaran**: Setelah Admin memverifikasi pembayaran, status tagihan otomatis berubah menjadi Lunas.
- **Dashboard**: Angka statistik (total kamar, pendapatan) berubah secara real-time sesuai perubahan data di modul lain.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Prompt Master - Mobile UI]], [[Schema]]
- [[Database ERD]], [[System Architecture]], [[Template - API Endpoint Spec]]
- [[Template - Architecture Decision Record]], [[Template - Feature Specification]], [[Web_Panel_Update_Summary]]
- [[API]], [[Deployment]], [[Roadmap]]
- [[Security]], [[Testing]], [[User-Flow]]
