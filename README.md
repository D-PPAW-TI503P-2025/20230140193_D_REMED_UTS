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

## Business Logic & Rule Validation

Aplikasi ini menerapkan beberapa aturan bisnis penting untuk menjaga integritas data dan hak akses:

1. **Role-Based Access Control (RBAC)**:
   - **Admin**: Memiliki akses penuh untuk melakukan operasi CRUD (Create, Read, Update, Delete) pada data buku. Admin juga dapat melihat seluruh riwayat peminjaman dari semua user.
   - **User**: Hanya dapat melihat buku dan melakukan peminjaman. **User dilarang mengakses API CRUD buku**. Jika mencoba, sistem akan mengembalikan status `403 Forbidden`.
   
2. **Pembatasan Peminjaman Admin**:
   - Akun dengan role `admin` **tidak diperbolehkan meminjam buku**. Fitur peminjaman hanya diperuntukkan bagi user biasa. Jika admin mencoba meminjam, sistem akan menolak request tersebut.

3. **Validasi Geolocation**:
   - Setiap transaksi peminjaman wajib menyertakan koordinat lokasi (Latitude & Longitude) yang valid untuk keperluan tracking.

4. **Manajemen Stok**:
   - Stok buku otomatis berkurang setiap kali peminjaman berhasil dilakukan.

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
| `GET` | `/api/borrow` | Melihat semua riwayat peminjaman (Admin) |

### 3. User Endpoints (Header `x-user-role: user` & `x-user-id: [id]`)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/borrow` | Meminjam buku dan mencatat lokasi |
| `GET` | `/api/borrow/my` | Melihat riwayat peminjaman milik sendiri |

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
npm start
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
#### Antarmuka Pengguna (Frontend)
| Halaman Beranda | Halaman Login | Halaman Registrasi |
| :---: | :---: | :---: |
| ![Beranda](Tugas%20MD/SS/HALAMAN%20BERANDA.jpeg) | ![Login](Tugas%20MD/SS/HALAMAN%20LOGIN.jpeg) | ![Registrasi](Tugas%20MD/SS/HALAMAN%20REGISTRASI.jpeg) |

| Daftar Buku (User) | Pinjam Buku (User) | Riwayat Pinjam (User) |
| :---: | :---: | :---: |
| ![Daftar Buku User](Tugas%20MD/SS/DAFTAR%20BUKU%20USER.jpeg) | ![Pinjam Buku](Tugas%20MD/SS/HALAMAN%20PINJAM%20BUKU%20USER.jpeg) | ![Riwayat User](Tugas%20MD/SS/LIST%20PEMINJAAN%20USER.jpeg) |

| Daftar Buku (Admin) | Kelola Buku (Admin) |
| :---: | :---: |
| ![Daftar Buku Admin](Tugas%20MD/SS/DAFTAR%20BUKU%20ADMIN.jpeg) | ![Kelola Admin](Tugas%20MD/SS/KELOLA%20BUKU%20ADMIN.jpeg) |

### 2. Dokumentasi Test API (Postman/Thunder Client)
#### Endpoints Testing
- **Get All Books & By ID**
  ![Get All](Tugas%20MD/SS/GET%20BUKU.jpeg)
  ![Get ID](Tugas%20MD/SS/GET%20BUKU%20BY%20ID.jpeg)

- **Admin Operations (Add, Edit, Delete)**
  ![Tambah](Tugas%20MD/SS/TAMBAH%20BUKU.jpeg)
  ![Edit](Tugas%20MD/SS/EDIT%20BUKU.jpeg)
  ![Hapus](Tugas%20MD/SS/HAPUS%20BUKU.jpeg)

- **User Operations (Borrow & Location)**
  ![Pinjam](Tugas%20MD/SS/PINJAM%20BUKU%20USER.jpeg)
  
- **Role-Based Access & Logic Validation**
  | Admin Tidak Bisa Pinjam | User Dilarang CRUD |
  | :---: | :---: |
  | ![Admin Pinjam Denied](Tugas%20MD/SS/ADMIN%20MEMINJAM%20BUKU.jpeg) | ![User CRUD Denied](Tugas%20MD/SS/AKSES%20USER%20DITOLAK.jpeg) |

- **History Logs (UI & API Testing)**
  | Riwayat Peminjaman (Admin - UI) | Riwayat Peminjaman (User - UI) |
  | :---: | :---: |
  | ![Log Admin UI](Tugas%20MD/SS/RIWAYAT%20PEMINJAMAN%20ADMIN.jpeg) | ![Log User UI](Tugas%20MD/SS/LIST%20PEMINJAAN%20USER.jpeg) |

  | Admin History (Postman) | User History (Postman) |
  | :---: | :---: |
  | ![Admin History API](Tugas%20MD/SS/LIHAT%20DAFTAR%20PEMINJAMAN%20ADMIN.jpeg) | ![User History API](Tugas%20MD/SS/LIHAT%20PEMINJAMAN%20USER.jpeg) |

### 3. Struktur Database (MySQL)
#### Tabel & Skema
| Database Buku | Database Peminjaman | Database User |
| :---: | :---: | :---: |
| ![Db Buku](Tugas%20MD/SS/DATABASE%20BUKU.jpeg) | ![Db Pinjam](Tugas%20MD/SS/DATABASE%20PEMINJAMAN.jpeg) | ![Db User](Tugas%20MD/SS/DATABASE%20USER.jpeg) |

#### Sinkronisasi Sequelize
![Sequelize](Tugas%20MD/SS/SEQUELIZE.jpeg)
