# 🚜 Toko Online Sparepart Alat Berat 

Website katalog **mirip toko online** untuk menjual sparepart alat berat dengan:

* **Hosting gratis** (GitHub Pages / Netlify)
* **Database Google Sheets**
* **Backend API Google Apps Script**
* **Order via WhatsApp**

Proyek ini cocok untuk UMKM / distributor yang ingin mulai online tanpa biaya server.

---

## ✨ Fitur

* Katalog produk (grid seperti marketplace)
* Harga & stok realtime dari Google Sheets
* Admin cukup update data via Google Sheets
* Order langsung ke WhatsApp admin
* 100% gratis (tanpa hosting & DB berbayar)

---

## 🧱 Arsitektur Sistem

```
User Browser
   ↓
Frontend (HTML, CSS, JS)
   ↓ fetch API
Google Apps Script (REST API)
   ↓
Google Sheets (Database)
```

---

## 🚀 Menjalankan di Komputer Lokal

1. Install browser-sync secara global (jika belum terpasang):
   ```bash
   npm install -g browser-sync
   ```
2. Buka terminal dan masuk ke direktori proyek:
   ```bash
   cd /path/ke/proyek/sparepart
   ```
3. Jalankan perintah berikut:
   ```bash
   browser-sync start --server --files "**/*.html, **/*.css, **/*.js"
   ```
4. Browser akan terbuka secara otomatis dengan fitur auto-reload

## 1️⃣ Persiapan Database (Google Sheets)

### 1. Buat Google Sheets baru

Nama bebas, contoh:

```
db-sparepart-alat-berat
```

### 2. Sheet: `produk`

| id | nama           | kategori | harga  | stok | deskripsi    | gambar      |
| -- | -------------- | -------- | ------ | ---- | ------------ | ----------- |
| 1  | Filter Oli CAT | Engine   | 250000 | 5    | Original CAT | https://... |

**Catatan:**

* Kolom `gambar` berisi URL gambar (Imgur / Cloudinary / Google Drive publik)
* Harga tanpa tanda titik/koma

---

### 3. Sheet: `kategori`

| id | nama          |
| -- | ------------- |
| 1  | Engine        |
| 2  | Hydraulic     |
| 3  | Undercarriage |

---

## 2️⃣ Backend API (Google Apps Script)

### 1. Buka Apps Script

* Buka Google Sheets
* Menu **Extensions → Apps Script**

### 2. Buat API

* Hapus kode default
* Paste kode API (lihat file `apps-script.js` di repo ini)

### 3. Deploy Web App

* Klik **Deploy → New deployment**
* Type: **Web App**
* Execute as: **Me**
* Who has access: **Anyone**
* Klik **Deploy**

📌 Simpan **URL Web App** (akan dipakai di frontend)

---

## 3️⃣ Frontend Website

### Struktur File

```
/
├── index.html
└── assets/
    └── css / img (opsional)
```

### Konfigurasi

Di file `index.html`:

* Ganti URL API Apps Script
* Ganti nomor WhatsApp admin

Contoh:

```
const PATH = "https://script.google.com/macros/s/AKfycbyNuM2rlMKRrvTaUHZEvZCFOLbg1TAcdnrAPCxnIoq75GFSOi5rJ-DfUlP8iFpT6DGnQA/exec";
const API = PATH + "?type=produk";
const WA  = "62812XXXXXXXX";
```

---

## 4️⃣ Hosting Gratis

### Opsi A: GitHub Pages

1. Buat repository baru
2. Upload semua file frontend
3. Buka **Settings → Pages**
4. Aktifkan GitHub Pages

Website akan online di:

```
https://username.github.io/nama-repo
```

---

## 5️⃣ Alur Order WhatsApp

1. User klik tombol **Order WhatsApp**
2. Pesan otomatis terbuka di WhatsApp:

```
Halo admin,
Saya ingin pesan:
Filter Oli CAT
Harga: Rp250000
Mohon info ketersediaan.
```

3. Admin konfirmasi manual

---

## 6️⃣ Cara Update Produk

* Buka Google Sheets
* Tambah/edit/hapus data produk
* Website update otomatis (realtime)

---