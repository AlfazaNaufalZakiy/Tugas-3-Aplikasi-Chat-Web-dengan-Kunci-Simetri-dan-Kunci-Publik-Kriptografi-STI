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
TBD

### Instalasi Dependensi
TBD

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

Frontend Vite biasanya berjalan pada:

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
TBD

## Struktur Folder
TBD
