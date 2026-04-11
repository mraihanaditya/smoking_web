Berikut README yang bisa langsung kamu pakai untuk GitHub. Sudah aku susun rapi, jelas, dan cocok untuk project kamu 👇

---

# 🚭 Website Edukasi Bahaya Merokok

Website ini merupakan proyek edukasi berbasis web yang bertujuan untuk meningkatkan kesadaran masyarakat tentang bahaya merokok dari berbagai aspek, seperti kesehatan, finansial, dan cara berhenti merokok.

---

## 📌 Deskripsi Project

Website ini berisi kumpulan artikel interaktif yang membahas:

* Dampak rokok terhadap kesehatan
* Kerugian finansial akibat merokok
* Cara efektif untuk berhenti merokok
* Fakta ilmiah dan data terpercaya

Setiap artikel dibuat dalam bentuk **card interaktif** dengan fitur:

* Ringkasan artikel
* Tombol *Selanjutnya* untuk melihat isi lengkap
* Scroll dalam card (tidak merusak layout)
* Tombol *Tutup* dan *Baca* (link eksternal)

---

## 🧠 Fitur Utama

### ✨ 1. Artikel Interaktif

* Tampilan card modern
* Expand & collapse konten
* Scroll hanya pada bagian teks
* Footer tetap (tidak ikut scroll)

### 🎯 2. Kategori Artikel

* Kesehatan 🫁
* Finansial 💸
* Cara Berhenti 🌱

### 📱 3. Responsive Design

* Tampilan tetap rapi di desktop & mobile
* Grid layout menyesuaikan layar

### 🔗 4. Sumber Data

Data diambil dari sumber terpercaya seperti:

* WHO
* Kemenkes RI
* CDC
* Alodokter
* KlikDokter
* Universitas Airlangga

---

## 🛠️ Teknologi yang Digunakan

* HTML5
* CSS3 (Flexbox & Grid)
* JavaScript (Vanilla JS)

---

## 📂 Struktur Project

```bash
📁 project-folder
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## ⚙️ Cara Menjalankan Project

1. Download / clone repository ini

```bash
git clone https://github.com/username/repository-name.git
```

2. Buka folder project

3. Jalankan file:

```bash
index.html
```

4. Bisa langsung dibuka di browser (Chrome/Edge)

---

## 🧩 Cara Menambah Artikel

Untuk menambahkan artikel baru:

1. Copy struktur artikel yang sudah ada:

```html
<article class="artikel-card">
```

2. Ubah:

* Judul
* Deskripsi singkat (`artikel-ringkas`)
* Isi lengkap (`artikel-full`)
* Kategori (`data-cat`)
* Link tombol "Baca"

3. Pastikan struktur tetap seperti ini:

```html
<div class="artikel-content">
  <p class="artikel-ringkas">...</p>
  <div class="artikel-full">...</div>
</div>

<div class="artikel-footer">...</div>
```

⚠️ **Penting:**
Footer harus di luar `.artikel-content` agar tidak terjadi bug scroll.

---

## 🐛 Bug yang Sudah Diperbaiki

* Footer ikut scroll ❌ → sekarang fixed ✅
* Scroll melewati batas card ❌ → sudah diperbaiki ✅
* Tombol tidak sejajar ❌ → sudah rapi ✅
* Layout rusak saat konten panjang ❌ → sudah stabil ✅

---

## 🎨 Tampilan

Website menggunakan desain modern dengan:

* Rounded card
* Soft shadow
* Warna netral + aksen hijau
* Typography yang nyaman dibaca

---

## 📈 Tujuan Project

Project ini dibuat untuk:

* Edukasi masyarakat tentang bahaya rokok
* Membantu perokok berhenti secara bertahap
* Menyampaikan informasi berbasis data

---

## 🤝 Kontribusi

Jika ingin berkontribusi:

* Tambahkan artikel baru
* Perbaiki desain
* Tambahkan fitur baru

---

## 📜 Lisensi

Project ini dibuat untuk keperluan edukasi dan pembelajaran.

---

## 🙌 Penutup

Semoga website ini dapat memberikan manfaat dan meningkatkan kesadaran tentang pentingnya hidup sehat tanpa rokok.

---

Kalau kamu mau, aku juga bisa bantu:

* bikin **preview screenshot section (biar README lebih keren)**
* atau bikin **badge GitHub (stars, license, dll)**
  biar kelihatan lebih profesional 🔥
