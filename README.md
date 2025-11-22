PrayMate — Aplikasi Pengingat Sholat & Al-Qur’an Digital

PrayMate adalah aplikasi web pengingat sholat dan Al-Qur'an digital yang membantu pengguna dalam menjalankan ibadah harian. Aplikasi ini dirancang ringan, responsif, modern, dan mudah digunakan.



🌟 Fitur Utama

1️⃣ Jadwal Sholat Harian
- Waktu sholat 5 waktu (Subuh, Dzuhur, Ashar, Maghrib, Isya)
- Deteksi lokasi otomatis melalui GPS
- Fallback ke lokasi default (Jakarta) jika izin lokasi ditolak
- Menampilkan tanggal Masehi dan Hijriah
- Informasi metode perhitungan (calculation method)
- ✔ Prayer Log: Pelacakan sholat harian
- ✔ Statistik 7 Hari: Persentase, streak, dan bar chart

2️⃣ Al-Qur'an Digital
- Daftar lengkap 114 surah
- Pencarian surah berdasarkan nama
- Tampilan ayat dalam teks Arab + terjemahan Indonesia
- Informasi surah (arti, jumlah ayat, tempat turun)
- ✔ Bookmark ayat favorit ⭐
- ✔ Pencarian ayat spesifik → format: `surah:ayat` (contoh: `2:255`)

3️⃣ Doa Harian & Dzikir
- 6+ doa penting: tidur, bangun tidur, masuk/keluar rumah, makan, dll.
- Teks Arab + Latin + Terjemahan
- ✔ Accordion UI yang rapi
- ✔ Fitur pencarian doa

4️⃣ Pengaturan Aplikasi
- Pilihan madhab Ashar (Syafi’i / Hanafi)
- Pilihan metode perhitungan jadwal sholat (20+ metode internasional)
- ✔ Toggle suara adzan
- ✔ Notifikasi adzan otomatis menggunakan browser notifications
- Semua pengaturan tersimpan di localStorage

5️⃣ PWA — Progressive Web App
- ✔ Installable pada Android / PC
- ✔ Dapat digunakan tanpa internet (offline support)
- ✔ Service worker & caching strategy
- ✔ Fast loading



🧩 Teknologi Utama
| Teknologi | Keterangan |
|---------|------------|
| HTML5 | Struktur UI |
| CSS3 | Neo-glassmorphism UI + Dark/Light Mode |
| JavaScript ES6+ | Modular logic aplikasi |
| Aladhan API | Jadwal sholat |
| Quran Gading API | Al-Qur’an teks & data |
| LocalStorage | Penyimpanan data offline |
| Service Worker | Mode offline + PWA |



🚀 Cara Menjalankan

🔹 Metode 1 — Langsung di Browser
`index.html` di browser modern 

🔹 Metode 2 — Live Server (Direkomendasikan)
```bash
Install ekstensi "Live Server" di VS Code
Klik kanan → Open with Live Server
🔹 Metode 3 — Python HTTP Server
bash
Copy code
python -m http.server 8000
# Buka http://localhost:8000/
