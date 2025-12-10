# 📝 CatatanKu - Progressive Web App (PWA)

Aplikasi catatan sederhana yang dirancang sebagai Progressive Web App (PWA), memungkinkan pengguna untuk **menginstal aplikasi langsung ke perangkat** (desktop atau mobile) dan **menggunakannya sepenuhnya secara offline**.

Proyek ini dibuat untuk memenuhi persyaratan PWA minimal: **HTTPS**, **Manifest**, dan **Service Worker**.

## ✨ Fitur Utama

* **Instalasi Mudah:** Dapat diinstal seperti aplikasi native di Android, iOS, Windows, atau macOS.
* **Mode Offline:** Berfungsi penuh bahkan tanpa koneksi internet.
* **Penyimpanan Lokal:** Catatan disimpan secara permanen di perangkat Anda menggunakan `localStorage`, memastikan data tidak hilang saat me-refresh halaman atau menutup aplikasi.
* **Antarmuka Sederhana:** Fokus pada kecepatan dan kemudahan pencatatan.

## 🛠️ Teknologi yang Digunakan

* **HTML5:** Struktur dasar aplikasi.
* **CSS3:** Styling minimalis dan responsif.
* **JavaScript (Vanilla):** Logika utama aplikasi dan fitur PWA.
* **Local Storage API:** Digunakan untuk penyimpanan data catatan (persistence).
* **Service Worker:** Mengaktifkan fitur caching dan offline.
* **Web App Manifest:** Menyediakan metadata untuk instalasi.

## 🚀 Instalasi dan Penggunaan

Aplikasi ini dapat langsung digunakan secara online dan diinstal ke perangkat Anda.

### 1. Prasyarat

Pastikan Anda memiliki [Node.js](https://nodejs.org/) terinstal jika ingin menjalankan secara lokal (disarankan untuk development).

### 2. Deployment Cepat (Vercel / Netlify)

Jika Anda ingin langsung mencoba di lingkungan produksi:

1.  *Fork* repositori ini ke akun GitHub Anda.
2.  Hubungkan repositori GitHub Anda ke **Vercel** atau **Netlify**.
3.  Platform akan secara otomatis men-deploy aplikasi di URL `https://...`.

### 3. Cara Instal Aplikasi

Setelah di-deploy ke URL `https://...`:

| Perangkat | Cara Instal (Tombol/Menu) |
| :--- | :--- |
| **Chrome (Desktop)** | Klik ikon `+` (Instal) di ujung kanan Address Bar. |
| **Android (Chrome)** | Klik menu titik tiga > Pilih **'Instal Aplikasi'** atau **'Tambahkan ke Layar Utama'**. |
| **iOS (Safari)** | Klik ikon **'Share'** (kotak panah ke atas) > Pilih **'Tambah ke Layar Utama'**. |

## 🧑‍💻 Kontribusi

Kami sangat menyambut kontribusi, saran, dan laporan bug untuk meningkatkan aplikasi ini.

1.  *Fork* repositori ini.
2.  Buat branch baru untuk fitur Anda (`git checkout -b fitur/nama-fitur`).
3.  Commit perubahan Anda (`git commit -m 'Tambahkan: Fitur keren baru'`).
4.  Dorong ke branch Anda (`git push origin fitur/nama-fitur`).
5.  Buka *Pull Request* baru.

---

### **Dibuat oleh KyeeLopA**
