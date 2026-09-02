# User Flows

## 1. Owner Flow

```mermaid
flowchart TD
    A[Login] --> B{Valid?}
    B -- Yes --> C[Owner Dashboard]
    B -- No --> A
    
    C --> D[Lihat Statistik Utama]
    C --> E[Lihat Laporan Keuangan]
    C --> F[Manajemen Users / Admin]
    
    E --> E1[Filter Rentang Waktu]
    E1 --> E2[Export PDF/Excel]
    
    F --> F1[Tambah Admin Baru]
    F --> F2[Edit/Hapus Admin]
```

## 2. Admin Flow

```mermaid
flowchart TD
    A[Login] --> B{Valid?}
    B -- Yes --> C[Admin Dashboard]
    B -- No --> A
    
    C --> D[Manajemen Kamar]
    C --> E[Manajemen Penghuni & Kontrak]
    C --> F[Manajemen Tagihan & Pembayaran]
    C --> G[Pencatatan Pengeluaran]
    
    D --> D1[Ubah Status Kamar]
    D --> D2[Edit Harga/Fasilitas]
    
    E --> E1[Registrasi Penghuni Baru]
    E1 --> E2[Buat Kontrak Sewa Baru]
    
    F --> F1[Generate Tagihan Bulanan]
    F --> F2[Verifikasi Bukti Transfer]
    F2 --> F3[Update Status -> Lunas]
    
    G --> G1[Input Pengeluaran Baru]
    G1 --> G2[Upload Bukti Struk]
```

## 3. Penghuni Flow

```mermaid
flowchart TD
    A[Login] --> B{Valid?}
    B -- Yes --> C[Penghuni Dashboard]
    B -- No --> A
    
    C --> D[Lihat Info Kamar & Kontrak]
    C --> E[Cek Tagihan Aktif]
    C --> F[Riwayat Pembayaran]
    
    E --> E1[Upload Bukti Pembayaran]
    E1 --> E2[Status Menunggu Verifikasi Admin]
    
    F --> F1[Download Bukti Lunas]
```

---
**Related Documents:**
- [[000 - Home Dashboard]], [[Agent]], [[Architecture]]
- [[Design]], [[Product Requirements Document]], [[Prompt Master - Mobile UI]]
- [[Schema]], [[Database ERD]], [[System Architecture]]
- [[Template - API Endpoint Spec]], [[Template - Architecture Decision Record]], [[Template - Feature Specification]]
- [[Web_Panel_Update_Summary]], [[API]], [[Deployment]]
- [[Roadmap]], [[Security]], [[Testing]]
