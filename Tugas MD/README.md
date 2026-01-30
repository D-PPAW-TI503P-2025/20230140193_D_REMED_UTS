# Tugas MD

Proyek backend sederhana untuk manajemen perpustakaan yang memiliki fitur peminjaman berbasis lokasi.

## Spesifikasi Teknis
- **Backend**: Node.js & Express.js
- **Database**: Sequelize ORM (MySQL)
- **Autentikasi**: Simulasi via Headers (`x-user-role` & `x-user-id`)

## Prasyarat
- Node.js terinstal
- MySQL server berjalan
- Database bernama `library_ucp1` sudah dibuat.

## Cara Menjalankan
1. Clone atau copy folder project.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Sesuaikan konfigurasi database di file `.env`.
4. Jalankan migrasi dan seeder:
   ```bash
   npx sequelize-cli db:migrate
   ```
5. Jalankan server:
   ```bash
   npm start
   ```

## Endpoints API

### 1. Public (Tanpa Header)
- `GET /api/books` : Melihat semua daftar buku.
- `GET /api/books/:id` : Detail buku.

### 2. Admin Mode (Header `x-user-role: admin`)
- `POST /api/books` : Tambah buku baru.
- `PUT /api/books/:id` : Update buku (Contoh: `/api/books/1`).
- `DELETE /api/books/:id` : Hapus buku.
- `GET /api/borrow` : Lihat semua riwayat peminjaman.

### 3. User Mode (Header `x-user-role: user` & `x-user-id: [id]`)
- `POST /api/borrow` : Meminjam buku.
  - **Body Payload**:
    ```json
    {
      "bookId": 1,
      "latitude": -6.2088,
      "longitude": 106.8456
    }
    ```
- `GET /api/borrow/my` : Lihat riwayat peminjaman saya.

## Dokumentasi & Screenshot

Berikut adalah dokumentasi hasil pengujian aplikasi (Silakan masukkan gambar di folder `screenshots/`):

### 1. Test Endpoint API (Postman/ThunderClient)
![Screenshot API Test](screenshots/api_test.png)
_Pengujian peminjaman buku dengan simulasi lokasi._

### 2. Tampilan Web
![Screenshot UI - Home](screenshots/ui_home.png)
_Tampilan katalog buku dan modal konfirmasi peminjaman._

![Screenshot UI - Admin](screenshots/ui_admin.png)
_Tampilan panel manajemen buku dan log peminjaman admin._

### 3. Struktur Database
![Screenshot Database](screenshots/db_structure.png)
_Struktur tabel pada MySQL._

---
**Dibuat untuk tugas UCP 1 Pengembangan Aplikasi Web.**