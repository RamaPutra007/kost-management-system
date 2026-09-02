# KOSTKU Design System

Design System ini adalah sekumpulan komponen UI yang dapat digunakan kembali (*reusable*) untuk membangun antarmuka aplikasi SaaS manajemen kost (KOSTKU). Semua komponen dirancang menggunakan React, TypeScript, Tailwind CSS, dan Lucide Icons, mengikuti panduan merek premium KOSTKU.

## Identitas Merek (Brand Tokens)

Desain sistem memanfaatkan variabel CSS global yang diatur di `src/style.css` untuk kompatibilitas penuh dengan Tailwind v4:
- **Primary**: `#2563EB`
- **Dark Navy**: `#0F172A`
- **Success**: `#22C55E`
- **Warning**: `#F59E0B`
- **Danger**: `#EF4444`
- **Background**: `#F8FAFC`

## Komponen Tersedia

Semua komponen terletak di direktori `src/components/ui/`.

### 1. Typography & Buttons
- **`Button`**: Mendukung varian (`primary`, `secondary`, `outline`, `ghost`, `danger`) dan ukuran (`sm`, `md`, `lg`, `icon`). Terintegrasi langsung dengan _loading state_ (memanggil komponen `Spinner` secara dinamis).

### 2. Form Elements
- **`Input`**: Input teks pintar yang mendukung pemasangan _icon_ (kiri/kanan) dan *error states*.
- **`Select`**: Dropdown bawaan yang telah dikustomisasi agar bersih dan senada dengan _Input_.
- **`Checkbox` & `Radio`**: Kontrol _form boolean_ kustom penuh warna *Primary* lengkap dengan animasi dan ring _focus_.

### 3. Layouing & Data Display
- **`Card`**: Menggunakan pola Compound Components (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `CardFooter`) untuk fleksibilitas maksimal dalam membuat kartu dashboard statis maupun form.
- **`Table`**: Tabel berbasis _sub-components_ (`TableHeader`, `TableRow`, `TableCell`, dll). Menampilkan perbatasan halus dan _hover states_.
- **`Badge`**: Indikator status (misalnya Lunas/Belum Lunas) berukuran mini, hadir dalam varian warna `success`, `warning`, `danger`, `info`, dan `default`.
- **`Avatar`**: Komponen gambar profil *circular* yang otomatis memuat fallback inisial teks jika tautan gambar patah.

### 4. Overlays & Navigation
- **`Modal`**: Kotak dialog yang muncul di tengah layar dengan latar *backdrop blur*. Menyediakan tata letak dinamis untuk bagian konten dan *footer*.
- **`Dropdown`**: Menu konteks mengambang (*popover* custom) untuk menaruh deretan aksi (misalnya Edit / Hapus data).
- **`Tabs`**: Tampilan multi-layar horizontal tanpa memuat ulang rute aplikasi, sangat efisien bagi perbandingan data (misalnya Tagihan Lunas vs Menunggak).
- **`Breadcrumb`**: Navigasi hirarkis yang jelas, digunakan di atas halaman.
- **`Pagination`**: Komponen paginasi nomor halaman pintar (mengelola pemotongan *ellipsis* otomatis jika halaman terlalu banyak).

### 5. Application States
- **`Alert`**: Banner pengumuman warna-warni yang langsung dibekali _Lucide Icons_ sesuai dengan urgensinya.
- **`EmptyState`**: Layout ketika data pada tabel/kartu belum tersedia. Menonjolkan ikon melingkar besar, instruksi ramah, dan CTA.
- **`Skeleton`**: Animasi *pulse* (berdenyut) untuk menipu persepsi mata sembari menunggu data API termuat (SaaS modern *loading indicator*).
- **`Spinner`**: Ikon bulat berputar yang mulus untuk tombol maupun loading konten skala kecil.

## Cara Penggunaan (Best Practices)

1. **JANGAN merancang UI per halaman sendiri.** Gunakan kembali komponen yang ada di folder `ui`.
2. Jika ada _design update_ mayor, perbarui di file komponen dasarnya atau sesuaikan token di `style.css`.
3. Gunakan `cn()` dari `src/lib/utils.ts` untuk melampirkan *Tailwind classnames* kustom dengan aman tanpa bentrok.
