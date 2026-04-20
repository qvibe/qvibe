# Q-VIBE

Q-VIBE (Quranic, Video Interaktif, Belajar, Efektif) adalah aplikasi pembelajaran Islam berbasis Next.js. Aplikasi ini menyediakan autentikasi pengguna, dashboard materi video, daftar worksheet PDF, dan halaman admin untuk mengelola materi belajar.

## Ringkasan Teknologi

- Next.js 16 dengan App Router
- React 19 dan TypeScript
- Tailwind CSS 4
- MongoDB untuk data user, video, dan metadata worksheet
- JWT di cookie `httpOnly` untuk sesi login
- Netlify Blobs untuk penyimpanan file PDF worksheet
- Netlify deployment config di `netlify.toml`

## Fitur Utama

- Registrasi user baru
- Login dan logout berbasis JWT cookie
- Dashboard video pembelajaran berdasarkan kategori
- Daftar worksheet PDF yang dapat dibuka atau diunduh
- Halaman admin untuk menambah video dan mengunggah worksheet
- Middleware untuk rewrite route dan proteksi akses

## Alur Aplikasi

### 1. Root route

File: `app/page.tsx`

- Saat user membuka `/`, aplikasi mengecek session.
- Jika session ada, user diarahkan ke dashboard.
- Jika tidak ada session, user diarahkan ke halaman login.

### 2. Auth flow

File utama:

- `app/api/auth/register/route.ts`
- `app/api/auth/login/route.ts`
- `app/api/auth/logout/route.ts`
- `app/lib/auth.ts`
- `app/lib/session.ts`

Perilaku:

- Register membuat user baru dengan password yang di-hash memakai `bcryptjs`.
- Register selalu membuat role default `user`.
- Login memverifikasi username dan password, lalu membuat JWT dengan masa berlaku 7 hari.
- Token disimpan pada cookie `token` dengan flag `httpOnly`, `secure`, dan `sameSite: 'strict'`.
- Logout menghapus cookie `token`.

Catatan:

- Tidak ada flow pembuatan admin dari UI.
- Untuk membuat admin pertama, user perlu register biasa lalu ubah field `role` di MongoDB menjadi `admin`.
- Middleware membaca session dengan `jose`, sedangkan page dan API route membaca session dengan `jsonwebtoken`.

### 3. Dashboard user

File utama:

- `app/pages/dashboard/page.tsx`
- `app/components/dashboardContent.tsx`
- `app/components/videoList.tsx`
- `app/components/worksheetList.tsx`

Perilaku:

- Dashboard hanya dirender jika user punya session.
- Dashboard memuat video berdasarkan kategori aktif dari `/api/videos`.
- Dashboard juga memuat daftar worksheet dari `/api/worksheets`.
- Jika role user adalah `admin`, tombol menuju halaman kelola materi ditampilkan.

### 4. Admin flow

File utama:

- `app/pages/admin/materi/page.tsx`
- `app/components/adminVideoForm.tsx`
- `app/components/adminWorksheetForm.tsx`
- `app/api/videos/route.ts`
- `app/api/worksheets/route.ts`

Perilaku:

- Admin dapat menambah video baru dengan judul, link YouTube, dan kategori.
- Admin dapat mengunggah worksheet PDF.
- File PDF disimpan ke Netlify Blobs store bernama `worksheet-store`.
- Metadata worksheet tetap disimpan di MongoDB.

## Routing

Struktur route saat ini memakai file di dalam `app/pages/...`, lalu `middleware.ts` menambahkan rewrite untuk beberapa alias route yang lebih pendek.

### Alias route dari middleware

| Route publik | Di-rewrite ke |
| --- | --- |
| `/login` | `/pages/login` |
| `/register` | `/pages/register` |
| `/dashboard` | `/pages/dashboard` |
| `/admin/*` | `/pages/admin/*` |

### Route yang benar-benar ada dari struktur folder

Karena file page berada di bawah `app/pages`, route internal berikut juga ada:

- `/pages/login`
- `/pages/register`
- `/pages/dashboard`
- `/pages/admin/materi`

Catatan implementasi:

- Beberapa komponen masih melakukan navigasi langsung ke `/pages/...`, bukan ke alias `/login`, `/register`, `/dashboard`, atau `/admin/...`.
- Dokumentasi ini menjelaskan perilaku kode saat ini, bukan perilaku yang diharapkan setelah refactor.

## Proteksi Akses

Logika utama ada di `middleware.ts`.

- `/api/auth/login` dan `/api/auth/register` boleh diakses tanpa login.
- Jika user sudah login lalu membuka `/login` atau `/register`, user diarahkan ke `/dashboard`.
- Route dashboard, route admin alias, dan semua `/api/*` mensyaratkan session aktif.
- Route admin alias dan request API non-`GET` mensyaratkan role `admin`.

Catatan penting:

- Proteksi middleware dipasang untuk alias seperti `/dashboard` dan `/admin/*`.
- Karena app juga memakai route langsung `/pages/...`, perilaku akses aktual perlu dipahami dari kombinasi route file, middleware matcher, dan validasi pada tiap page/API handler.

## API Reference

### Auth

#### `POST /api/auth/register`

Request body:

```json
{
  "username": "string",
  "password": "string"
}
```

Perilaku:

- Mengecek apakah username sudah dipakai
- Menyimpan password yang sudah di-hash
- Membuat user dengan role `user`

#### `POST /api/auth/login`

Request body:

```json
{
  "username": "string",
  "password": "string"
}
```

Response sukses:

```json
{
  "success": true,
  "role": "admin | user"
}
```

Perilaku:

- Memverifikasi kredensial user
- Menyetel cookie session `token`

#### `POST /api/auth/logout`

Perilaku:

- Menghapus cookie session

### Videos

#### `GET /api/videos?category=<nama-kategori>`

Perilaku:

- Mengambil data video dari MongoDB
- Jika query `category` ada, hasil difilter berdasarkan kategori
- Hasil diurutkan dari `createdAt` terbaru

#### `POST /api/videos`

Role: `admin`

Request body:

```json
{
  "title": "string",
  "youtubeLink": "string",
  "category": "string"
}
```

Perilaku:

- Menyimpan video baru ke collection `videos`

### Worksheets

#### `GET /api/worksheets`

Perilaku:

- Mengambil metadata worksheet dari MongoDB
- Tidak mengambil file PDF langsung, hanya metadata dan `fileUrl`

#### `POST /api/worksheets`

Role: `admin`

Request:

- `multipart/form-data`
- field `title`
- field `category`
- field `file` berformat PDF

Perilaku:

- Validasi bahwa file adalah PDF
- Menyimpan file ke Netlify Blobs
- Menyimpan metadata worksheet ke collection `worksheets`
- Menghasilkan `fileUrl` berbentuk `/api/blobs/<key>`

### Blob proxy

#### `GET /api/blobs/[...key]`

Perilaku:

- Mengambil file PDF dari Netlify Blobs
- Mengembalikan response `application/pdf`
- File dibuka `inline` di browser

### Health check database

#### `GET /api/testdb`

Perilaku:

- Menjalankan `ping` ke MongoDB
- Dipakai untuk memastikan koneksi database aktif

## Struktur Data

### Collection `users`

Contoh field:

```json
{
  "_id": "ObjectId",
  "username": "string",
  "password": "hashed-string",
  "role": "user | admin",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Collection `videos`

Contoh field:

```json
{
  "_id": "ObjectId",
  "title": "string",
  "youtubeLink": "string",
  "category": "string",
  "createdAt": "Date"
}
```

### Collection `worksheets`

Contoh field:

```json
{
  "_id": "ObjectId",
  "title": "string",
  "category": "string",
  "fileUrl": "/api/blobs/worksheets/<filename>.pdf",
  "createdAt": "Date"
}
```

## Struktur Folder

```text
app/
  api/
    auth/
      login/
      logout/
      register/
    blobs/[...key]/
    testdb/
    videos/
    worksheets/
  components/
    adminVideoForm.tsx
    adminWorksheetForm.tsx
    dashboardContent.tsx
    passwordInput.tsx
    videoList.tsx
    worksheetList.tsx
  lib/
    auth.ts
    db.ts
    session.ts
  pages/
    admin/materi/
    dashboard/
    login/
    register/
  types/
  globals.css
  layout.tsx
  page.tsx
middleware.ts
next.config.ts
netlify.toml
```

## Environment Variable

Buat file `.env.local` dan isi minimal:

```env
MONGODB_URI=mongodb://...
JWT_SECRET=your-secret-key
```

Catatan:

- `MONGODB_URI` dipakai di `app/lib/db.ts`
- `JWT_SECRET` dipakai di `app/lib/auth.ts` dan `app/lib/session.ts`
- Storage worksheet bergantung pada runtime Netlify Blobs saat deploy

## Menjalankan Project Secara Lokal

### Install dependency

```bash
npm install
```

### Jalankan development server

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Jalankan production server

```bash
npm run start
```

## Deploy

Konfigurasi saat ini disiapkan untuk Netlify:

- Build command: `npm run build`
- Publish directory: `.next`
- Plugin: `@netlify/plugin-nextjs`

Worksheet PDF disimpan memakai Netlify Blobs, jadi environment deploy harus mendukung layanan tersebut.

## Catatan Implementasi Saat Ini

- `README.md` sebelumnya masih boilerplate dari `create-next-app`; file ini menggantikannya dengan dokumentasi project yang sesuai kode.
- Metadata global di `app/layout.tsx` masih memakai nilai default `Create Next App`.
- Kategori worksheet di dashboard dan kategori worksheet di form admin belum sepenuhnya seragam, jadi perilaku filter mengikuti string kategori yang tersimpan di database.
