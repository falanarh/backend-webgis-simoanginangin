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

* Untuk pengembangan lokal:

```bash
npm run dev
```
* Untuk build produksi:
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
    "username": "admin123",
    "password": "admin123"
  }
  ```
* **Response:**
  * **Status Code:**
    * `201 Created` - Admin berhasil didaftarkan
    * `500 Internal Server Error` - Terjadi kesalahan pada server
  * **Body Response (Sukses):**
    ```json
    {
        "statusCode": 201,
        "message": "Admin registered successfully",
        "data": {
            "_id": "ObjectId",
            "username": "admin123"
        }
    }
    ```
  * **Body Response (Gagal):**
    ```json
    {
        "statusCode": 500,
        "message": "Error message"
    }
    ```
### 2. Login Admin

* **Metode:** POST
* **URL:** `/api/auth/login`
* **Deskripsi:** Endpoint ini digunakan untuk masuk sebagai admin.
* **Request Body:**
  ```json
  {
    "username": "admin123",
    "password": "admin123"
  }
  ```
* **Response:**
  * **Status Code:**
    * `200 OK` - Login berhasil
    * `400 Bad Request` - Username atau password salah
  * **Body Response (Sukses):**
    ```json
    {
        "statusCode": 200,
        "message": "Login successful",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  * **Body Response (Gagal):**
    ```json
    {
        "statusCode": 400,
        "message": "Username tidak ditemukan atau Password salah"
    }
    ```

### 3. Create RT

* **Metode:** POST
* **URL:** `/api/rt`
* **Deskripsi:** Endpoint ini digunakan untuk membuat satu atau banyak RT baru.
* **Request Body:**
  ```json
  [
    {
        "type": "FeatureCollection",
        "name": "1_1",
        "crs": {
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            },
            "type": "name",
            "_id": "66b0402de5766f482d0baba6"
        },
        "features": [
            {
                "geometry": {
                    "type": "MultiPolygon",
                    "coordinates": [
                        [
                            [
                                [
                                    112.59619776137656,
                                    -7.437989251414538
                                ],
                                [
                                    112.5963520236192,
                                    -7.438024995443467
                                ],
                                [
                                    112.59651234440068,
                                    -7.438062360598442
                                ],
                                [
                                    112.59685182708118,
                                    -7.438140827413536
                                ],
                                [
                                    112.59728517278327,
                                    -7.438241883139578
                                ],
                                [
                                    112.59752770935013,
                                    -7.438299629258295
                                ],
                                [
                                    112.59871024639641,
                                    -7.438574772425484
                                ],
                                [
                                    112.59896100454179,
                                    -7.438637274059174
                                ],
                                [
                                    112.59885480915234,
                                    -7.439679929075571
                                ],
                                [
                                    112.5988640191912,
                                    -7.43969544567096
                                ],
                                [
                                    112.5989815584881,
                                    -7.439717973453496
                                ],
                                [
                                    112.59895095592347,
                                    -7.439981577954474
                                ],
                                [
                                    112.59890727567074,
                                    -7.440036288490863
                                ],
                                [
                                    112.59884898553423,
                                    -7.440028272787752
                                ],
                                [
                                    112.59882363566706,
                                    -7.440003136341915
                                ],
                                [
                                    112.59876745488043,
                                    -7.439990228436734
                                ],
                                [
                                    112.5981818625299,
                                    -7.439862805356795
                                ],
                                [
                                    112.59773239899998,
                                    -7.439786488999971
                                ],
                                [
                                    112.59727090955299,
                                    -7.4396546252466
                                ],
                                [
                                    112.59702310996745,
                                    -7.440425020823196
                                ],
                                [
                                    112.59686591594047,
                                    -7.440397082007183
                                ],
                                [
                                    112.5967319290609,
                                    -7.440409395479275
                                ],
                                [
                                    112.596626432462,
                                    -7.44048074807101
                                ],
                                [
                                    112.596612693524,
                                    -7.440728287012388
                                ],
                                [
                                    112.596509651484,
                                    -7.440730030244849
                                ],
                                [
                                    112.5965222788082,
                                    -7.440537115665468
                                ],
                                [
                                    112.59625507750572,
                                    -7.440528963314268
                                ],
                                [
                                    112.59612583344399,
                                    -7.440932644065579
                                ],
                                [
                                    112.59566407299998,
                                    -7.44076674899997
                                ],
                                [
                                    112.59524249199998,
                                    -7.440595641999928
                                ],
                                [
                                    112.59581996199998,
                                    -7.43901887199995
                                ],
                                [
                                    112.59619776137656,
                                    -7.437989251414538
                                ]
                            ]
                        ]
                    ]
                },
                "properties": {
                    "kode": "3515090013001001",
                    "rt": "001",
                    "rw": "001",
                    "dusun": "Simo",
                    "label": "RT 001 RW 001 DUSUN SIMO",
                    "jml_ruta": 0,
                    "jml_umkm": 0,
                    "jml_umkm_kbli_a": 0,
                    "jml_umkm_kbli_b": 0,
                    "jml_umkm_kbli_c": 0,
                    "jml_umkm_kbli_d": 0,
                    "jml_umkm_kbli_e": 0,
                    "jml_umkm_kbli_f": 0,
                    "jml_umkm_kbli_g": 0,
                    "jml_umkm_kbli_h": 0,
                    "jml_umkm_kbli_i": 0,
                    "jml_umkm_kbli_j": 0,
                    "jml_umkm_kbli_k": 0,
                    "jml_umkm_kbli_l": 0,
                    "jml_umkm_kbli_m": 0,
                    "jml_umkm_kbli_n": 0,
                    "jml_umkm_kbli_o": 0,
                    "jml_umkm_kbli_p": 0,
                    "jml_umkm_kbli_q": 0,
                    "jml_umkm_kbli_r": 0,
                    "jml_umkm_kbli_s": 0,
                    "jml_umkm_kbli_t": 0,
                    "jml_umkm_kbli_u": 0,
                    "jml_umkm_lokasi_bangunan_khusus_usaha": 0,
                    "jml_umkm_lokasi_bangunan_campuran": 0,
                    "jml_umkm_lokasi_kaki_lima": 0,
                    "jml_umkm_lokasi_keliling": 0,
                    "jml_umkm_lokasi_didalam_bangunan_tempat_tinggal_online": 0,
                    "jml_umkm_bentuk_pt_persero_sejenisnya": 0,
                    "jml_umkm_bentuk_ijin_desa_ijin_lainnya": 0,
                    "jml_umkm_bentuk_tidak_berbadan_hukum": 0,
                    "jml_umkm_skala_usaha_mikro": 0,
                    "jml_umkm_skala_usaha_kecil": 0,
                    "jml_umkm_skala_usaha_menengah": 0
                },
                "type": "Feature",
                "_id": "66b0402de5766f482d0baba7"
            }
        ]
    }
  ]
  ```