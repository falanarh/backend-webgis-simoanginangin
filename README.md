# Backend WebGIS Simoanginangin

Repositori ini merupakan proyek backend website peta tematik desa cantik untuk pemetaan UMKM Desa Simoangin-angin. Proyek ini mengimplementasikan konsep RESTful API yang sering menjadi standar dalam pembuatan backend website. API ini dibangun menggunakan Node.js, TypeScript, Express, dan MongoDB.

## Daftar Isi

- [Fitur](#fitur)
- [Struktur Proyek](#struktur-proyek)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Library Penting](#library-penting)
- [Variabel Lingkungan](#variabel-lingkungan)
- [Endpoint API](#endpoint-api)

## Fitur

- **RESTful API** untuk mengelola data `UMKM`, `Rumah Tangga`, `RT` (Rukun Tetangga), dan `Admin`.
- Menggunakan **MongoDB** untuk penyimpanan data, dengan **Mongoose** sebagai ODM (Object Data Modeling).
- **JWT (JSON Web Token)** untuk autentikasi yang aman.
- **Logging** menggunakan **Winston**.
- **TypeScript** untuk keamanan tipe.

## Struktur Proyek

```
backend-webgis-simoanginangin/
├── src/
│ ├── config/ # Konfigurasi aplikasi
│ ├── controllers/ # Logic handler untuk setiap route
│ ├── middleware/ # Middleware Express
│ ├── models/ # Model data Mongoose
│ ├── routes/ # Definisi route API
│ ├── services/ # Business logic
│ ├── types/ # Type definitions
│ ├── utils/ # Utility functions
│ ├── app.ts # Konfigurasi Express app
│ └── server.ts # Entry point aplikasi
├── .env # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json # Konfigurasi TypeScript
└── README.md
```


## Instalasi

Untuk memulai proyek ini, clone repositori dan instal dependensi:

```bash
git clone https://github.com/falanarh/backend-webgis-simoanginangin.git
cd backend-webgis-simoanginangin
npm install
```

## Menjalankan Aplikasi

```
a. Untuk pengembangan lokal:
```
```bash
npm run dev
```
```
b. Untuk build produksi:
```
```bash
npm run build
npm start
```

## Library Penting

- **Express**: Framework ringan untuk membangun REST API di Node.js.
- **Mongoose**: Library ODM untuk MongoDB dan Node.js.
- **JSON Web Token (JWT)**: Digunakan untuk autentikasi dan pengiriman informasi dengan aman.
- **Winston**: Library logging yang serbaguna untuk aplikasi Node.js.
- **TypeScript**: Bahasa pemrograman yang menambahkan tipe statis pada JavaScript, memberikan alat pengembangan yang lebih baik.

## Variabel Lingkungan

Untuk melakukan konfigurasi database MongoDB yang digunakan dalam proyek, perlu menyiapkan file .env untuk menyimpan berbagai variabel lingkungan yang diperlukan. File .env secara khusus untuk proyek ini dapat diperoleh melalui link berikut ini https://drive.google.com/drive/folders/1zkaP8E0a1DEKVcYNlUfWxzSPFtI7TonK?usp=sharing.

## Endpoint API

### 1. Registrasi Admin

* **Metode:** POST
* **URL:** `/api/auth/register`
* **Deskripsi:** Endpoint ini digunakan untuk mendaftarkan pengguna baru sebagai admin.
* **Request Body:**
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```