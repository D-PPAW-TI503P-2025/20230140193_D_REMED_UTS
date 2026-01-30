# Library System with Geolocation - UCP 1

## Identitas Mahasiswa
- **NIM:** 20230140193
- **Mata Kuliah:** Pengembangan Aplikasi Web
- **Tugas:** UCP 1 (Remedial UTS)

---

## Deskripsi Proyek
Library System with Geolocation adalah aplikasi backend sederhana untuk manajemen perpustakaan yang memiliki fitur peminjaman buku berbasis lokasi. Aplikasi ini mengimplementasikan simulasi autentikasi dan otorisasi menggunakan Headers untuk membedakan hak akses antara **Admin** dan **User**.

### Tujuan Utama
Mengevaluasi kemampuan praktis dalam:
1. Penggunaan Node.js dan NPM.
2. Pembuatan server dengan Express.js.
3. Implementasi routing dan middleware (Otorisasi Role).
4. Interaksi database menggunakan Sequelize ORM.
5. Perancangan RESTful API yang fungsional.

---

## Fitur Utama
- **Public Access**: Melihat daftar buku dan detail buku.
- **Admin Mode**: Manajemen data buku (Tambah, Edit, Hapus).
- **User Mode**: Fitur peminjaman buku yang mencatat koordinat lokasi (Latitude & Longitude).
- **Geolocation tracking**: Menyimpan lokasi saat transaksi peminjaman dilakukan.

---

## Teknologi yang Digunakan
- **Frontend**: React (Client side)
- **Backend**: Node.js & Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Simulasi Auth**: Custom Middleware via Request Headers

---

## Struktur Database (Sequelize)

### 1. Model: `Book`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment |
| `title` | String | Judul buku (Not Null) |
| `author` | String | Penulis buku (Not Null) |
| `stock` | Integer | Jumlah stok tersedia |

### 2. Model: `BorrowLog`
| Field | Type | Description |
| :--- | :--- | :--- |
| `id` | Integer | Primary Key, Auto Increment |
| `userId` | Integer | ID User yang meminjam |
| `bookId` | Integer | ID Buku yang dipinjam |
| `borrowDate` | Date | Tanggal peminjaman |
| `latitude` | Float | Koordinat lintang user |
| `longitude` | Float | Koordinat bujur user |

---

## Dokumentasi API (Endpoints)

### Simulasi Autentikasi
Aplikasi menggunakan Header untuk simulasi role:
- `x-user-role`: `admin` (Akses penuh), `user` (Hanya peminjaman).
- `x-user-id`: ID User (Hanya untuk mode `user`).

### 1. Public Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/books` | Mengambil semua daftar buku |
| `GET` | `/api/books/:id` | Mengambil detail satu buku berdasarkan ID |

### 2. Admin Endpoints (Header `x-user-role: admin`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/books` | Menambahkan buku baru |
| `PUT` | `/api/books/:id` | Memperbarui data buku |
| `DELETE` | `/api/books/:id` | Menghapus buku dari sistem |

### 3. User Endpoints (Header `x-user-role: user` & `x-user-id: [id]`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/borrow` | Meminjam buku dan mencatat lokasi |

**Body Payload `POST /api/borrow`**:
```json
{
 "bookId": 1,
 "latitude": -6.2088,
 "longitude": 106.8456
}
```

---

## Cara Menjalankan Aplikasi

### Persiapan
1. Pastikan **Node.js** dan **NPM** sudah terinstal.
2. Pastikan **MySQL** aktif (Port default MySQL di `.env` adalah `3309`).
3. Buat database di MySQL dengan nama `perpustakaangeo`.

### Instalasi & Konfigurasi
1. Clone repository atau buka folder project.
2. Masuk ke folder server:
   ```bash
   cd 20230140193-server
   ```
3. Instal dependencies:
   ```bash
   npm install
   ```
4. Jalankan migrasi database:
   ```bash
   npx sequelize-cli db:migrate
   ```

### Menjalankan Server
```bash
npm run dev
# Server akan berjalan di http://localhost:5000
```

### Menjalankan React (Frontend)
1. Buka terminal baru, masuk ke folder react:
   ```bash
   cd 20230140193-react
   ```
2. Instal dependencies:
   ```bash
   npm install
   ```
3. Jalankan client:
   ```bash
   npm start
   ```

---

## Dokumentasi Screenshot

### 1. Tampilan Web Application
*(Foto akan ditambahkan di sini)*

### 2. Dokumentasi Test API (Postman/Thunder Client)
*(Foto akan ditambahkan di sini)*

### 3. Struktur Database (MySQL)
*(Foto akan ditambahkan di sini)*
