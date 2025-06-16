---

# Scandidate – AI CV Reviewer

Scandidate adalah aplikasi web yang bisa ngereview CV secara otomatis pakai AI. Pengguna bisa upload file CV (PDF atau TXT), lalu aplikasi bakal kasih skor, highlight grammar error, dan kasih saran perbaikan. Dibangun dengan Next.js dan Tailwind CSS untuk frontend, serta Flask untuk backend-nya.
Semua fitur dan kode dalam proyek ini dibuat sendiri oleh Hugo Sachio Wijaya dengan sedikit bantuan template dari sumber eksternal yang bersifat open source dan non attribution (tidak perlu kredit)
Anggota Kelompok
-FELIX STEVANUS 2702252090
Computer Science
-DARREN WINATA
2702256044
Computer Science
-HUGO SACHIO WIJAYA
2702261151
Computer Science
-ATHALLAH PASHA RAMADHAN
2702255874
Computer Science
-JEREMY EMMANUEL PUTRA
2702250305
Computer Science

## Fitur Utama

- Upload CV dalam format PDF atau TXT
- CV otomatis dinilai dan diberi skor 0–100
- Grammar error disorot
- Saran perbaikan berdasarkan isi CV
- Login dan register user
- Riwayat hasil review per user
- Toggle dark mode
- Antarmuka responsif

## Tech Stack

Frontend: Next.js, Tailwind CSS, React  
Backend: Flask (Python)  
ML Models: Naive Bayes dan Random Forest untuk penilaian CV  
NLP: spaCy untuk grammar checking  
Parser: pdfplumber untuk file PDF

## Cara Instalasi

1. Clone repository:
   git clone https://github.com/username/scandidate.git
   cd scandidate

2. Install semua dependency:
   pnpm install
   atau
   npm install

3. Jalankan server lokal:
   pnpm dev
   atau
   npm run dev

4. Buka browser dan akses:
   http://localhost:3000

Jangan lupa jalankan juga backend Flask-nya karena frontend akan request ke backend untuk proses AI.

## Cara Pakai

1. Register akun baru atau login
2. Masuk ke halaman review
3. Upload file CV (PDF atau TXT)
4. Klik tombol untuk mulai review
5. Tunggu hasil keluar berupa:
   - Skor penilaian
   - Highlight grammar error
   - Saran perbaikan
6. Semua riwayat tersimpan dan bisa dilihat kapan saja

## Detail Teknis

Backend Flask menerima file dari frontend, lalu:
- Membaca file PDF dengan pdfplumber atau teks langsung dari TXT
- Menganalisis isi CV pakai model ML (Naive Bayes + Random Forest)
- Mengecek grammar dengan spaCy
- Mengembalikan hasil analisis dalam bentuk JSON ke frontend

Frontend Next.js:
- Routing menggunakan App Router
- Menggunakan Tailwind CSS untuk styling
- Terdapat halaman login, register, review, dan profile
- State disimpan menggunakan React hooks
- Fitur dark mode toggle

## Struktur Folder

scandidate/
├── app/                halaman dan layout utama  
├── components/         komponen reusable  
├── hooks/              custom hooks  
├── lib/                helper dan fetch API  
├── models/             skema atau fungsi AI (jika ada)  
├── public/             gambar dan aset publik  
├── styles/             global stylesheet  
├── tailwind.config.ts konfigurasi Tailwind  
└── ...

## Author

Hugo Sachio Wijaya 2025
Semua coding dan logika aplikasi dikerjakan secara mandiri.
Walaupun berkelompok, semua code dikerjakan oleh saya Hugo SAchio Wijaya
Tugas ini dikumpulkan untuk portfolio Apple Academy 2025 dan tugas Software Engineering COMP6100001 LM01 Tahun ajaran Genap 2024/2025

## Lisensi

Creative Commons Attribution-NonCommercial-NoDerivatives 4.0  
Tidak boleh digunakan untuk keperluan komersial tanpa izin.
```
