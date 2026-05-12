# Tugas-3-Aplikasi-Chat-Web-dengan-Kunci-Simetri-dan-Kunci-Publik-Kriptografi-STI

## Anggota Kelompok
- Nicholas Francis Aditjandra - 18221005
- Michael Jeremi Bungaran S - 18221136
- Alfaza Naufal Zakiy - 18222126

## Deskripsi Program
Aplikasi ini merupakan aplikasi chat berbasis web yang menerapkan mekanisme kriptografi kunci-publik dan kunci-simetri untuk mengamankan komunikasi antar pengguna. Sistem menyediakan fitur registrasi, login, daftar kontak, pengiriman pesan, serta penyimpanan riwayat pesan dalam bentuk terenkripsi.

Pada saat registrasi, klien membangkitkan pasangan kunci ECDH menggunakan Web Crypto API. Private key pengguna dienkripsi terlebih dahulu menggunakan AES-256-GCM dengan kunci yang diturunkan dari password, kemudian disimpan di server dalam bentuk terenkripsi. Password pengguna tidak disimpan dalam bentuk plainteks, melainkan di-hash menggunakan bcrypt dengan salt unik.

Setelah login berhasil, backend menerbitkan JWT dalam format JWS yang ditandatangani menggunakan ECDSA ES256 melalui library JWT lokal. Untuk komunikasi antar pengguna, aplikasi melakukan key exchange menggunakan ECDH, kemudian shared secret diproses dengan HKDF untuk menghasilkan kunci AES-256-GCM. Pesan dikirim dan disimpan dalam bentuk ciphertext sehingga server tidak mengetahui isi pesan asli. Aplikasi juga menambahkan MAC berbasis HMAC-SHA-256 untuk membantu memverifikasi integritas pesan.

## Teknologi yang Digunakan (*tech stack*)
| Komponen | Teknologi |
| --- | --- |
| Frontend | React, TypeScript, Vite |
| Backend | Go, Fiber |
| Database | SQLite |
| HTTP Client | Axios |
| Kriptografi sisi klien | Web Crypto API |
| Hash password | bcrypt dengan salt unik |
| JWT backend | Library lokal pada `backend/pkg/jwtlib` dan ECDSA ES256 |

Dependensi utama frontend terdapat pada `frontend/package.json`, sedangkan dependensi backend terdapat pada `backend/go.mod`.

## Dependensi
### Frontend
- React
- React DOM
- TypeScript
- Vite
- Axios
- Lucide React
- React Router DOM
- Web Crypto API

### Backend
- Go
- Fiber
- SQLite
- go-sqlite3
- bcrypt dari `golang.org/x/crypto`
- Library JWT lokal pada `backend/pkg/jwtlib`
- Package kriptografi bawaan Go seperti `crypto/ecdsa`, `crypto/x509`, dan `crypto/rand`

### Kebutuhan Sistem
- Node.js dan npm
- Go
- GCC 64-bit untuk menjalankan dependency SQLite berbasis CGO
- Browser modern yang mendukung Web Crypto AP

## Instalasi Dependensi
### Frontend
Masuk ke folder frontend, lalu install dependensi Node.js menggunakan npm. Dependensi yang digunakan sudah didefinisikan pada `frontend/package.json`.
```bash
cd frontend
npm install
```

### Backend
Masuk ke folder backend, lalu rapikan dan unduh dependensi Go module. Dependensi backend sudah didefinisikan pada `backend/go.mod`.
```bash
cd backend
go mod tidy
```

Karena backend menggunakan SQLite melalui `github.com/mattn/go-sqlite3`, sistem perlu memiliki compiler C 64-bit yang dapat digunakan oleh CGO. Pada Windows, compiler dapat disediakan melalui MSYS2 UCRT64.

## Tata cara menjalankan program
### Backend

```bash
cd backend
go mod tidy
go run main.go
```

Backend berjalan pada:

```text
http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend Vite berjalan pada:

```text
http://localhost:5173
```

### Verifikasi Build

Perintah verifikasi:

```bash
cd frontend
npm run build
```

```bash
cd backend
go test ./...
```

## *Environment/configuration*
Aplikasi menggunakan konfigurasi lokal sebagai berikut:
| Komponen | Konfigurasi |
| --- | --- |
| Backend URL | `http://localhost:3000` |
| Frontend URL | `http://localhost:5173` |
| Database | SQLite lokal |
| File database | `backend/chat.db` |
| API base URL frontend | `http://localhost:3000` |
| JWT issuer | `ii4021-tugas-3` |
| JWT audience | `secure-chat` |
| Algoritma JWT | ECDSA ES256 |
| Kurva ECDH client | P-256 |
| Enkripsi pesan | AES-256-GCM |
| Derivasi kunci pesan | HKDF SHA-256 |
| MAC pesan | HMAC-SHA-256 |
| Derivasi kunci private key | PBKDF2 SHA-256 |

## Struktur Folder
TBD
