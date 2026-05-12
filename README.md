# Tugas-3-Aplikasi-Chat-Web-dengan-Kunci-Simetri-dan-Kunci-Publik-Kriptografi-STI

## Anggota Kelompok
- Nicholas Francis Aditjandra - 18221005
- Michael Jeremi Bungaran S - 18221136
- Alfaza Naufal Zakiy - 18222126

## Deskripsi Program
TBD

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
