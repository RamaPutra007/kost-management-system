# REST API Documentation

Base URL: `/api/v1`

## 1. Authentication
Endpoints terkait autentikasi pengguna.

### Login
- **Method**: `POST`
- **URL**: `/login`
- **Authentication**: None
- **Role**: All
- **Request**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Validation**: `email` (required, email), `password` (required).
- **Response**: `200 OK` (token, user object).
- **Error**: `401 Unauthorized` (Invalid credentials).

### Logout
- **Method**: `POST`
- **URL**: `/logout`
- **Authentication**: Bearer Token
- **Role**: All
- **Request**: Empty
- **Response**: `200 OK` (Message: Successfully logged out).
- **Error**: `401 Unauthorized`.

---

## 2. Dashboard
Endpoint untuk metrik dashboard.

### Get Dashboard Stats
- **Method**: `GET`
- **URL**: `/dashboard/stats`
- **Authentication**: Bearer Token
- **Role**: Owner, Admin, Penghuni (Response disesuaikan berdasarkan role)
- **Request**: Empty
- **Response**: `200 OK` (JSON metrics seperti total kamar, pendapatan, dll).
- **Error**: `401 Unauthorized`.

---

## 3. Kost
Informasi properti.

### Get Kost Info
- **Method**: `GET`
- **URL**: `/kost`
- **Authentication**: Bearer Token
- **Role**: All
- **Response**: `200 OK` (Kost details).

---

## 4. Kamar
Manajemen data kamar.

### List Kamar
- **Method**: `GET`
- **URL**: `/kamar`
- **Authentication**: Bearer Token
- **Role**: All (Penghuni hanya melihat list, detail terbatas)
- **Response**: `200 OK` (Array of kamar).

### Create Kamar
- **Method**: `POST`
- **URL**: `/kamar`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: `nomor_kamar`, `tipe`, `harga`, `fasilitas`, `status`
- **Response**: `201 Created`
- **Error**: `403 Forbidden`, `422 Unprocessable Entity`.

---

## 5. Penghuni
Manajemen data penghuni.

### List Penghuni
- **Method**: `GET`
- **URL**: `/penghuni`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Response**: `200 OK` (Array of penghuni).

### Create Penghuni
- **Method**: `POST`
- **URL**: `/penghuni`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: Data NIK, nama, email, password, dll.
- **Response**: `201 Created`.

---

## 6. Kontrak
Manajemen kontrak sewa.

### List Kontrak
- **Method**: `GET`
- **URL**: `/kontrak`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner (Penghuni view their own)
- **Response**: `200 OK`.

### Create Kontrak
- **Method**: `POST`
- **URL**: `/kontrak`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: `kamar_id`, `penghuni_id`, `tanggal_mulai`, `tanggal_selesai`, `harga_kesepakatan`.
- **Response**: `201 Created`.
- **Error**: `422 Unprocessable Entity` (Jika kamar sudah terisi).

---

## 7. Tagihan
Manajemen tagihan.

### List Tagihan
- **Method**: `GET`
- **URL**: `/tagihan`
- **Authentication**: Bearer Token
- **Role**: All (Penghuni view their own)
- **Response**: `200 OK`.

### Create Tagihan
- **Method**: `POST`
- **URL**: `/tagihan`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: `penghuni_id`, `kontrak_sewa_id`, `bulan_tagihan`, `nominal`.
- **Response**: `201 Created`.

---

## 8. Pembayaran
Verifikasi dan proses pembayaran.

### Submit Pembayaran
- **Method**: `POST`
- **URL**: `/pembayaran`
- **Authentication**: Bearer Token
- **Role**: Penghuni, Admin, Owner
- **Request**: `tagihan_id`, `nominal_bayar`, `metode_pembayaran`, `bukti_pembayaran`.
- **Response**: `201 Created`.

### Verifikasi Pembayaran
- **Method**: `PUT`
- **URL**: `/pembayaran/{id}/verify`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: `status_verifikasi` (Valid/Invalid).
- **Response**: `200 OK`.

---

## 9. Pengeluaran
Manajemen biaya operasional.

### List Pengeluaran
- **Method**: `GET`
- **URL**: `/pengeluaran`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Response**: `200 OK`.

### Create Pengeluaran
- **Method**: `POST`
- **URL**: `/pengeluaran`
- **Authentication**: Bearer Token
- **Role**: Admin, Owner
- **Request**: `kategori_id`, `tanggal`, `nominal`, `keterangan`.
- **Response**: `201 Created`.

---

## 10. Laporan
Generate laporan.

### Laporan Keuangan
- **Method**: `GET`
- **URL**: `/laporan/keuangan`
- **Authentication**: Bearer Token
- **Role**: Owner, Admin
- **Request**: Query `start_date`, `end_date`.
- **Response**: `200 OK` (JSON summary, or PDF link).

---

## 11. Notifikasi
Notifikasi in-app.

### Get Notifications
- **Method**: `GET`
- **URL**: `/notifications`
- **Authentication**: Bearer Token
- **Role**: All
- **Response**: `200 OK`.

---

## 12. Users
Manajemen akun pengguna sistem.

### List Users
- **Method**: `GET`
- **URL**: `/users`
- **Authentication**: Bearer Token
- **Role**: Owner
- **Response**: `200 OK`.

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[Deployment]], [[Roadmap]]
- [[Security]], [[Testing]], [[User-Flow]]
