# Testing Strategy

Dokumen ini mendefinisikan strategi dan ruang lingkup pengujian (testing) untuk Kost Management System.

## 1. Unit Testing
Pengujian pada tingkat fungsi atau method individu untuk memastikan logika bisnis dasar berjalan dengan benar tanpa dependensi eksternal yang kompleks.
- **Backend (PHPUnit)**: Menguji logika perhitungan denda, penentuan status kamar, format respons model.
- **Frontend (Vitest)**: Menguji rendering komponen UI (Button, Input, Table) dan logika custom hooks.

## 2. Feature Testing
Pengujian pada satu alur fitur (seperti endpoint API) termasuk interaksi dengan database menggunakan environment testing.
- **Contoh**: Menguji endpoint `POST /api/tagihan` apakah berhasil menyimpan data ke database dan mengembalikan HTTP status 201.

## 3. API Testing
Pengujian spesifik pada antarmuka REST API untuk memastikan request/response sesuai kontrak yang didefinisikan di `API.md`.
- Menggunakan Postman atau tool serupa.
- Memeriksa kebenaran struktur JSON, tipe data, dan HTTP status codes.

## 4. Authorization Testing
Memastikan akses terkontrol berdasarkan role pengguna (Owner, Admin, Penghuni).
- **Contoh**: Penghuni mencoba mengakses endpoint `/api/pengeluaran` harus menerima respon `403 Forbidden`.
- Memastikan Policy Laravel berfungsi memblokir penghuni melihat tagihan milik penghuni lain.

## 5. Validation Testing
Memastikan sistem menolak input data yang tidak valid, format salah, atau field mandatory yang kosong.
- **Contoh**: Input email tanpa `@` harus ditolak, input nominal pembayaran berupa huruf harus ditolak.

## 6. Frontend Testing
Menguji interaksi komponen pada level antarmuka pengguna.
- Memastikan state berubah saat tombol diklik.
- Memastikan navigasi React Router berjalan tanpa me-reload halaman penuh.
- Memeriksa tampilan state error atau loading.

## 7. Integration Testing
Memastikan berbagai modul dapat bekerja bersama.
- **Contoh**: Integrasi antara modul Pembayaran dan modul Tagihan, yaitu saat pembayaran diverifikasi, status tagihan otomatis berubah menjadi "Lunas".

## 8. E2E (End-to-End) Testing
Mensimulasikan perilaku pengguna nyata dari awal login hingga menyelesaikan suatu flow proses penuh di browser.
- Tool: Cypress atau Laravel Dusk.
- **Flow Utama**: Login Admin -> Registrasi Penghuni -> Buat Kontrak -> Generate Tagihan -> Bayar (Penghuni) -> Verifikasi (Admin).

## 9. Performance Testing
Memastikan sistem dapat menangani beban query atau user bersamaan.
- Waktu respon API harus di bawah 500ms untuk query non-laporan.
- Indexing database untuk mencegah query yang lambat saat data membesar.

## 10. Security Testing
Menguji sistem terhadap celah keamanan umum.
- Mencoba injeksi SQL pada form input.
- Mencoba cross-site scripting (XSS) pada input keterangan pengeluaran.
- Memastikan endpoint yang memerlukan file upload hanya menerima format gambar/dokumen yang diizinkan dan menolak executable script.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[API]], [[Deployment]]
- [[Roadmap]], [[Security]], [[User-Flow]]
