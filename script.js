/**
 * BerhentiSekarang — script.js
 * Website Interaktif Edukasi Bahaya Merokok
 * Fitur: Kalkulator Finansial, Peta Organ, Video Player, Filter Artikel
 */

// ============================================================
// 1. NAVBAR: Scroll effect & Mobile Menu
// ============================================================

const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

// Tambahkan class 'scrolled' saat halaman di-scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Toggle mobile menu saat hamburger diklik
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Fungsi menutup mobile menu (dipanggil dari HTML link)
function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

// ============================================================
// 2. KALKULATOR FINANSIAL
// ============================================================

// Sinkronisasi slider batang rokok dengan input angka
const sliderBatang  = document.getElementById('sliderBatang');
const inputBatang   = document.getElementById('batangPerHari');
const sliderVal     = document.getElementById('sliderVal');

// Ketika slider digeser, update input dan label
sliderBatang.addEventListener('input', () => {
  const val = sliderBatang.value;
  inputBatang.value = val;
  sliderVal.textContent = `${val} batang`;
  updateSliderBackground(sliderBatang);
  hitungKalkulator(); // hitung otomatis saat slider bergerak
});

// Ketika input angka berubah, update slider
inputBatang.addEventListener('input', () => {
  const val = Math.min(Math.max(inputBatang.value, 1), 100);
  sliderBatang.value = val;
  sliderVal.textContent = `${val} batang`;
  updateSliderBackground(sliderBatang);
});

// Update warna track slider sesuai nilai
function updateSliderBackground(slider) {
  const min = slider.min || 0;
  const max = slider.max || 100;
  const val = ((slider.value - min) / (max - min)) * 100;
  slider.style.background = `linear-gradient(to right, #c0392b ${val}%, #e5ddd2 ${val}%)`;
}

// Inisialisasi slider background saat halaman dimuat
updateSliderBackground(sliderBatang);

// ============================================================
// FUNGSI HANDLE CALL: Smart untuk Desktop & Mobile
// ============================================================
function handleCall(phoneNumber) {
  // Deteksi apakah menggunakan mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  if (isMobile) {
    // Di mobile, buka protocol tel untuk panggil langsung
    window.location.href = `tel:${phoneNumber}`;
  } else {
    // Di desktop, copy nomor ke clipboard dan tampilkan notifikasi
    navigator.clipboard.writeText(phoneNumber).then(() => {
      alert(`✓ Nomor Quitline.INA (${phoneNumber}) sudah dicopy ke clipboard!\n\nAnda bisa hubungi langsung melalui telepon Anda.`);
    }).catch(() => {
      // Fallback jika copy gagal
      alert(`Nomor Quitline.INA: ${phoneNumber}\n\nSilakan salin nomor ini dan hubungi melalui telepon Anda.`);
    });
  }
}

/**
 * Fungsi format angka ke format Rupiah
 * @param {number} angka - angka yang akan diformat
 * @returns {string} - string format Rupiah
 */
function formatRupiah(angka) {
  return 'Rp ' + Math.round(angka).toLocaleString('id-ID');
}

/**
 * Fungsi utama kalkulator — dipanggil saat tombol "Hitung" ditekan
 * atau saat slider digeser
 */
function hitungKalkulator() {
  // Ambil nilai dari input
  const hargaBungkus     = parseFloat(document.getElementById('hargaBungkus').value)     || 25000;
  const batangPerHari    = parseFloat(document.getElementById('batangPerHari').value)     || 10;
  const batangPerBungkus = parseFloat(document.getElementById('batangPerBungkus').value)  || 16;

  // Hitung harga per batang
  const hargaPerBatang = hargaBungkus / batangPerBungkus;

  // Hitung biaya per periode
  const perHari        = hargaPerBatang * batangPerHari;
  const perBulan       = perHari * 30;
  const perTahun       = perBulan * 12;
  const perLimaTahun   = perTahun * 5;
  const perSepuluhTahun = perTahun * 10;

  // Tampilkan hasil ke DOM dengan animasi
  animateValue('perHari',         perHari);
  animateValue('perBulan',        perBulan);
  animateValue('perTahun',        perTahun);
  animateValue('perLimaTahun',    perLimaTahun);
  animateValue('perSepuluhTahun', perSepuluhTahun);

  // Update badge per hari
  document.getElementById('perHari').textContent = formatRupiah(perHari);

  // Tampilkan "bisa beli apa" berdasarkan uang tahunan
  tampilkanBisaBeli(perTahun);
}

/**
 * Animasi angka berubah ke nilai target
 * @param {string} elementId - id elemen yang diupdate
 * @param {number} targetVal - nilai akhir
 */
function animateValue(elementId, targetVal) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Mulai dari 0, animasikan ke target dalam 500ms
  let start = 0;
  const duration = 500;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Easing: ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (targetVal - start) * eased;
    el.textContent = formatRupiah(current);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/**
 * Tampilkan visualisasi "bisa beli apa" dengan uang rokok setahun
 * @param {number} perTahun - biaya rokok per tahun dalam Rupiah
 */
function tampilkanBisaBeli(perTahun) {
  // Database barang dan harganya
  const barang = [
    { icon: '🛵', nama: 'Motor Baru', harga: 18000000 },
    { icon: '📱', nama: 'Smartphone', harga: 3500000 },
    { icon: '👟', nama: 'Sepatu Brand', harga: 800000 },
    { icon: '✈️', nama: 'Tiket Pesawat', harga: 900000 },
    { icon: '🍜', nama: 'Makan Siang', harga: 25000 },
    { icon: '📚', nama: 'Buku', harga: 75000 },
    { icon: '☕', nama: 'Cangkir Kopi', harga: 45000 },
    { icon: '🎮', nama: 'Game PS5', harga: 800000 },
    { icon: '🎬', nama: 'Nonton Bioskop', harga: 50000 },
  ];

  // Database barang mahal
  const barangMahal = [
    { icon: '💍', nama: 'Emas Perhiasan', harga: 50000000 },
    { icon: '🏍️', nama: 'Motor Sport Mewah', harga: 150000000 },
    { icon: '🚗', nama: 'Mobil Baru ', harga: 250000000 },
    { icon: '🏠', nama: 'Rumah di Depok', harga: 300000000 },
  ];

  const beliGrid = document.getElementById('beliGrid');
  beliGrid.innerHTML = '';

  // Pilih 6 barang yang relevan berdasarkan budget
  const dipilih = barang
    .filter(b => perTahun >= b.harga)  // hanya tampilkan yang bisa dibeli minimal 1x
    .slice(0, 6);

  if (dipilih.length === 0) {
    beliGrid.innerHTML = '<p style="color:var(--clr-text-lt);font-size:0.85rem;grid-column:1/-1;text-align:center;">Masukkan data yang valid untuk melihat simulasi ini.</p>';
  } else {
    dipilih.forEach(b => {
      const qty = Math.floor(perTahun / b.harga);
      const item = document.createElement('div');
      item.className = 'beli-item';
      item.innerHTML = `
        <span class="beli-icon">${b.icon}</span>
        <span class="beli-qty">${qty}x</span>
        <span>${b.nama}</span>
      `;
      beliGrid.appendChild(item);
    });
  }

  // Tampilkan barang mahal - hitung berapa tahun dibutuhkan
  const beliGridMahal = document.getElementById('beliGridMahal');
  beliGridMahal.innerHTML = '';

  barangMahal.forEach(b => {
    // Hitung berapa tahun rokok dibutuhkan untuk mencapai harga barang
    const tahunDibutuhkan = b.harga / perTahun;
    
    // Tampilkan jika realistis (kurang dari 20 tahun)
    if (tahunDibutuhkan <= 20) {
      const item = document.createElement('div');
      item.className = 'beli-item-mahal';
      item.innerHTML = `
        <span class="beli-icon">${b.icon}</span>
        <span class="beli-qty">1x ${b.nama}</span>
        <span class="beli-waktu">${tahunDibutuhkan.toFixed(1)} Tahun (Rp ${Math.round(b.harga).toLocaleString('id-ID')})</span>
      `;
      beliGridMahal.appendChild(item);
    }
  });

  // Jika tidak ada item mahal yang bisa dibeli, tampilkan pesan
  if (beliGridMahal.children.length === 0) {
    beliGridMahal.innerHTML = '<p style="color:var(--clr-text-lt);font-size:0.85rem;grid-column:1/-1;text-align:center;padding:20px;">Tingkatkan budget rokok untuk melihat item premium. Atau lebih baik berhenti merokok! 😊</p>';
  }
}

// Hitung otomatis saat halaman pertama dimuat
document.addEventListener('DOMContentLoaded', () => {
  hitungKalkulator();
});

// ============================================================
// 3. PETA TUBUH INTERAKTIF
// ============================================================

/**
 * Database informasi organ dan dampak merokok
 * Setiap organ memiliki emoji, nama, badge risiko, deskripsi,
 * statistik, dan daftar dampak
 */
const organData = {
  otak: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 27 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.81909 19.1253C3.81909 19.1253 6.87909 22.0353 9.18909 22.1853C10.6628 22.2565 12.1358 22.0286 13.5191 21.5153C15.4734 22.0771 17.5391 22.1287 19.5191 21.6653C22.3591 20.8453 21.9891 16.8153 21.9891 16.8153L13.3991 13.8953L3.81909 19.1253Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.42896 21.1453C7.64866 21.3499 8.90154 21.1199 9.96899 20.4953" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.3689 22.0353C9.17988 21.8974 9.97897 21.6968 10.7589 21.4353" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.759 21.2853L18.239 21.8253" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.429 20.0953C17.66 20.8377 19.0988 21.1605 20.529 21.0153" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.66888 19.4953C8.66888 19.4953 11.6689 20.4953 11.6689 25.3253H14.6689C14.6689 25.3253 15.1189 21.3253 17.2089 18.9753L18.0289 18.1553C17.2542 17.5247 16.3692 17.0432 15.4189 16.7353C13.4789 15.9853 13.7789 16.1353 11.4189 16.6653C9.68888 17.0553 8.13892 19.1253 8.13892 19.1253L8.66888 19.4953Z" fill="white" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.259 1.95528C13.259 1.95528 11.699 0.235276 10.199 0.535276C8.69898 0.835276 3.03895 4.71528 1.91895 6.28528C1.08263 7.64601 0.73027 9.24928 0.918951 10.8353C1.06895 11.2153 1.28901 11.6553 1.28901 11.6553C1.28901 11.6553 -0.131005 12.9253 0.838995 15.6553C1.80899 18.3853 3.44899 19.5353 4.83899 19.8353C6.12974 20.1691 7.49492 20.0636 8.719 19.5353C9.46434 19.0764 10.1853 18.579 10.879 18.0453C11.3121 18.0774 11.7472 18.0213 12.158 17.8803C12.5688 17.7394 12.9468 17.5165 13.269 17.2253C13.6517 17.6339 14.1411 17.9272 14.6819 18.0721C15.2227 18.217 15.7932 18.2077 16.329 18.0453C16.8096 18.7371 17.4607 19.293 18.2194 19.6592C18.978 20.0254 19.8184 20.1894 20.659 20.1353C21.9411 20.0414 23.16 19.5422 24.1397 18.7099C25.1194 17.8776 25.809 16.7553 26.109 15.5053C26.4353 14.0789 26.2806 12.5846 25.669 11.2553C25.7782 8.93207 25.0349 6.64897 23.579 4.83528C21.109 1.69528 18.129 1.32528 16.629 0.835279C15.129 0.345279 13.259 1.95528 13.259 1.95528Z" fill="#E39292" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.219 17.1853V1.95528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.0688 6.76528C12.771 6.7552 12.4786 6.68332 12.21 6.55421C11.9415 6.4251 11.7027 6.24157 11.5089 6.01528C10.9089 5.26528 10.2389 6.31528 10.0889 5.01528C9.93887 3.71528 10.0088 2.84528 9.48883 2.77528C9.15501 2.79704 8.83146 2.89938 8.54584 3.07354C8.26022 3.2477 8.02109 3.48849 7.84888 3.77528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.1589 3.59528C10.5616 3.28296 10.8299 2.8287 10.9089 2.32528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.88904 6.95528L7.76904 5.91528L8.14905 5.01528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.76886 5.91528C7.41521 6.19317 7.11383 6.53178 6.87885 6.91528C6.74392 7.17454 6.64309 7.45016 6.57886 7.73528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.259 11.4353C12.9327 11.9456 12.4994 12.379 11.989 12.7053C11.169 13.2253 9.37901 12.3353 8.85901 11.8053C8.33901 11.2753 7.58903 9.19529 7.06903 8.44529C6.54903 7.69529 6.06905 7.44528 5.27905 7.85528C4.78554 8.20347 4.4173 8.70141 4.229 9.27529" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.7289 8.82528C11.7289 8.82528 11.2789 9.71528 11.1289 10.0953C10.9789 10.4753 10.8289 8.97528 10.1289 8.22528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.76904 10.4653C7.76904 10.4653 7.09904 11.3653 6.76904 11.4653" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.25885 13.9753C7.16296 14.0579 7.05103 14.1198 6.93011 14.1571C6.8092 14.1945 6.68192 14.2065 6.55615 14.1925C6.43038 14.1784 6.30887 14.1385 6.19922 14.0753C6.08956 14.0121 5.99408 13.927 5.91882 13.8253C5.24882 13.0753 5.01882 12.8253 4.41882 12.8253C3.95926 12.8549 3.50717 12.9561 3.07886 13.1253" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.63906 5.31528C4.63906 5.31528 2.76907 6.73528 2.46907 8.15528C2.33203 9.4299 2.53919 10.7179 3.06905 11.8853C3.28905 12.3353 2.24903 12.7753 2.91903 13.8853C3.45255 14.7026 4.08024 15.4544 4.78908 16.1253C5.89989 15.8884 7.05079 15.9158 8.14907 16.2053C9.0976 16.7148 9.99504 17.3143 10.8291 17.9953" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M4.78903 16.1353C4.46173 16.2245 4.17363 16.4206 3.97067 16.6924C3.76771 16.9642 3.6615 17.2961 3.66897 17.6353C3.51897 18.9753 4.66897 19.4253 5.97897 19.7253" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M3.06903 11.8853C3.06903 11.8853 1.94905 11.2153 1.27905 11.6553" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M0.759033 15.0153C0.759033 15.0153 1.64906 16.0653 2.46906 16.0653" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.87891 2.62528C6.87891 2.62528 5.87891 3.22528 5.87891 3.62528C5.87891 4.02528 7.29889 4.51528 7.29889 4.51528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.42896 4.41528L5.67896 5.68528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M11.429 4.04528C11.6452 3.49407 11.9201 2.96771 12.249 2.47528C12.629 2.02528 13.249 3.07528 13.249 3.07528C13.249 3.07528 14.519 1.73528 14.889 3.07528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.249 2.47528L11.729 1.65528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.1189 4.19528C19.1189 4.19528 17.3989 2.85528 16.8089 3.74528C16.2189 4.63528 16.9589 6.13528 15.6889 6.88528C15.0002 7.32296 14.1713 7.48373 13.3689 7.33528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M14.939 9.86528C14.939 9.86528 15.089 10.0953 15.759 9.64528C16.429 9.19528 16.279 8.64528 16.959 8.07528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M13.1489 12.3353C13.1489 12.3353 15.9089 13.3353 16.9589 12.3353C18.0089 11.3353 17.6989 10.3353 18.1489 9.79528C18.5989 9.25528 19.7189 8.30528 19.5689 7.47528C19.4137 6.91985 19.0572 6.44214 18.5689 6.13528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.5691 7.47528C19.7922 7.34454 20.0412 7.26425 20.2986 7.24006C20.556 7.21587 20.8156 7.24838 21.0591 7.33528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.1489 9.76528C18.3317 10.1732 18.5993 10.5376 18.9338 10.8341C19.2683 11.1307 19.662 11.3527 20.0889 11.4853" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23.8989 9.64528C24.1004 10.8627 24.0493 12.1085 23.7489 13.3053C23.2289 14.7253 22.8489 14.8653 22.8489 14.8653C21.6806 14.7888 20.5097 14.9697 19.4189 15.3953C18.0789 16.0653 16.9589 16.1353 16.4189 17.1053L15.8989 18.1053" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.8489 14.8653C22.8489 14.8653 25.1689 15.4653 24.7189 16.9653" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M24.6489 15.6953C24.6489 15.6953 25.3889 15.3153 25.3889 13.7553" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M25.619 11.2153L24.269 10.9853" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M22.179 5.09528C22.4352 5.12154 22.6746 5.23533 22.8568 5.41749C23.0389 5.59964 23.1527 5.83902 23.179 6.09528L23.329 6.98528C23.329 6.98528 24.819 7.43528 24.379 8.55528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.259 2.76528C20.5252 3.09839 20.7218 3.48163 20.8369 3.89221C20.952 4.3028 20.9833 4.73234 20.929 5.15528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.1389 1.76528C16.8716 1.63645 17.6261 1.73776 18.2989 2.05528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.429 17.1053C16.429 17.1053 18.8189 19.1053 21.3589 18.1053" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.8391 16.8153C21.1186 16.7384 21.4111 16.7206 21.6979 16.7629C21.9847 16.8052 22.2595 16.9066 22.505 17.0609C22.7505 17.2151 22.9612 17.4187 23.1237 17.6588C23.2862 17.8988 23.397 18.1701 23.4491 18.4553" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M16.259 13.8953C16.259 13.8953 14.619 14.0453 14.919 15.1653" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.989 10.0953C20.989 10.0953 21.579 10.0153 22.479 8.82528" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21.8088 9.64528L21.9589 10.6853" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.88892 14.7653C9.08194 15.035 9.32771 15.2627 9.61133 15.4345C9.89495 15.6064 10.2105 15.719 10.5389 15.7653C10.8806 15.8317 11.2328 15.8194 11.569 15.7293C11.9051 15.6392 12.2163 15.4737 12.4789 15.2453" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M23.7489 13.3053C23.159 12.8228 22.421 12.558 21.6589 12.5553" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.67896 9.64528C5.41936 9.79541 5.19549 10.0001 5.02283 10.2453C4.85016 10.4905 4.73283 10.7703 4.67896 11.0653" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
    nama: 'Otak',
    risk: 'Risiko Tinggi',
    desc: 'Nikotin mencapai otak dalam 10 detik setelah dihirup dan memanipulasi sistem dopamin — neurotransmitter yang mengatur kebahagiaan. Seiring waktu, otak kehilangan kemampuan merasa senang tanpa rokok.',
    stat1Val: '2-4×', stat1Label: 'Risiko stroke lebih tinggi',
    stat2Val: '40%', stat2Label: 'Penurunan fungsi kognitif',
    dampak: [
      'Stroke: Rokok menyebabkan penyempitan pembuluh darah otak',
      'Kecanduan nikotin yang permanen mengubah struktur otak',
      'Penurunan memori, konsentrasi, dan kemampuan belajar',
      'Risiko demensia meningkat 30-40% pada perokok aktif',
      'Depresi dan kecemasan kronis akibat ketidakseimbangan dopamin',
    ]
  },
  paru: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 44 47" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.3862 0.5H20.1362V20.24L17.5662 23.08L19.6962 27.36L21.7562 25.24L25.2761 27.68L26.0861 22L23.3862 19.83V0.5Z" fill="white" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.0863 21.81C18.7801 21.4835 18.5483 21.0945 18.4067 20.6699C18.2652 20.2452 18.2173 19.7949 18.2663 19.35C18.4663 17.91 19.9063 16.27 18.0563 14.02C16.2063 11.77 9.05634 12.17 4.51634 19.56C-0.0236573 26.95 -0.413701 45.41 1.8463 46.24C4.1063 47.07 16.6163 43.98 18.4663 41.72C20.3163 39.46 19.4663 29.2 19.6963 27.36C19.7108 25.4925 19.506 23.6298 19.0863 21.81Z" fill="#E39292" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M24.6765 21.81C24.9805 21.482 25.2109 21.0929 25.3523 20.6686C25.4937 20.2444 25.5429 19.7948 25.4965 19.35C25.2865 17.91 23.8565 16.27 25.6965 14.02C27.5365 11.77 34.6965 12.17 39.2465 19.56C43.7965 26.95 44.1665 45.41 41.9165 46.24C39.6665 47.07 27.1365 43.98 25.2865 41.72C23.4365 39.46 24.2865 29.2 24.0565 27.36C24.0491 25.4923 24.2571 23.63 24.6765 21.81Z" fill="#E39292" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.4062 5.64H23.1163" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.4062 10.64H23.1163" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.4062 15.64H23.1163" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M20.4062 20.65H23.1163" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>`,
    nama: 'Paru-Paru',
    risk: 'Risiko Sangat Tinggi',
    desc: 'Paru-paru adalah organ yang paling langsung terpapar rokok. Tar dalam rokok melapisi dinding alveoli, mengurangi kapasitas pertukaran oksigen secara permanen. Setiap batang rokok merusak ribuan alveoli yang tidak bisa pulih.',
    stat1Val: '85%', stat1Label: 'Kanker paru akibat rokok',
    stat2Val: '50%', stat2Label: 'Penurunan kapasitas paru',
    dampak: [
      'Kanker paru-paru: 85% kasus disebabkan rokok',
      'PPOK (Penyakit Paru Obstruktif Kronis) — sesak napas permanen',
      'Emfisema: kerusakan kantung udara yang tidak bisa diperbaiki',
      'Bronkitis kronis dengan batuk berdahak berkepanjangan',
      'Penurunan saturasi oksigen darah yang memengaruhi seluruh organ',
    ]
  },
  jantung: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.27891 12.75C5.27891 12.75 0.718898 14.89 0.518898 18.94C0.318898 22.99 1.70889 28.34 4.56889 30.25C7.42889 32.16 15.8689 35.25 18.9689 34.89C22.0689 34.53 22.6489 32.51 23.1289 29.3C23.6089 26.09 22.4189 22.51 21.8189 20.61C21.2189 18.71 19.0789 16.09 17.5389 14.66C15.9989 13.23 15.1589 12.87 12.0589 12.04C8.95894 11.21 5.27891 12.75 5.27891 12.75Z" fill="#E39292"/>
                  <path opacity="0.58" d="M5.27891 12.75C5.27891 12.75 0.718898 14.89 0.518898 18.94C0.318898 22.99 1.70889 28.34 4.56889 30.25C7.42889 32.16 15.8689 35.25 18.9689 34.89C22.0689 34.53 22.6489 32.51 23.1289 29.3C23.6089 26.09 22.4189 22.51 21.8189 20.61C21.2189 18.71 19.0789 16.09 17.5389 14.66C15.9989 13.23 15.1589 12.87 12.0589 12.04C8.95894 11.21 5.27891 12.75 5.27891 12.75Z" fill="white"/>
                  <path d="M5.27891 12.75C5.27891 12.75 0.718898 14.89 0.518898 18.94C0.318898 22.99 1.70889 28.34 4.56889 30.25C7.42889 32.16 15.8689 35.25 18.9689 34.89C22.0689 34.53 22.6489 32.51 23.1289 29.3C23.6089 26.09 22.4189 22.51 21.8189 20.61C21.2189 18.71 19.0789 16.09 17.5389 14.66C15.9989 13.23 15.1589 12.87 12.0589 12.04C8.95894 11.21 5.27891 12.75 5.27891 12.75Z" stroke="#263238" stroke-miterlimit="10"/>
                  <path d="M7.77908 16.56C7.77908 16.56 5.39908 16.21 5.27908 12.75C5.15908 9.29002 8.72909 5.38002 8.72909 5.38002C8.3789 4.60312 7.98148 3.84837 7.53909 3.12001L6.46908 1.21002L8.24911 0.500015C8.77286 1.01098 9.25131 1.5664 9.67911 2.16002C10.0391 2.76002 10.7491 4.16002 10.7491 4.16002V1.16002L12.6591 1.04001L13.2491 4.49002C13.2491 4.49002 12.8991 3.66002 15.6291 4.61002C18.3591 5.56002 19.4391 8.30002 19.5591 10.44C19.5302 12.217 19.2508 13.9811 18.7291 15.68L14.7291 12.68C14.7291 12.68 15.0891 8.16002 13.2991 8.52002C11.5091 8.88002 11.7591 10.66 10.5691 13.28C9.37906 15.9 7.77908 16.56 7.77908 16.56Z" fill="white" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M9.71899 14.89C9.71899 14.89 12.099 9.29003 14.479 8.46003C15.987 7.84969 17.6185 7.60633 19.239 7.75002C20.079 7.87002 20.429 9.41003 20.429 10.96C20.429 12.51 18.169 11.79 16.859 13.22C15.549 14.65 15.789 17.22 15.789 17.22" fill="#E39292"/>
                  <path d="M9.71899 14.89C9.71899 14.89 12.099 9.29003 14.479 8.46003C15.987 7.84969 17.6185 7.60633 19.239 7.75002C20.079 7.87002 20.429 9.41003 20.429 10.96C20.429 12.51 18.169 11.79 16.859 13.22C15.549 14.65 15.789 17.22 15.789 17.22" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21.5589 21.34C21.1684 20.7033 20.6024 20.1929 19.9289 19.87L19.4388 19.68C19.2902 19.6099 19.1466 19.5297 19.0088 19.44C18.7268 19.2576 18.4594 19.0537 18.2088 18.83C17.6972 18.3717 17.2193 17.8771 16.7789 17.35L16.1488 17.91C16.6558 18.4327 17.2007 18.9174 17.7789 19.36L17.9889 19.49C17.3429 20.1124 16.8322 20.8613 16.4889 21.69C16.0744 22.7702 15.9772 23.9464 16.2088 25.08C16.3488 26.18 16.5489 27.27 16.6689 28.36C16.8811 29.4417 16.7299 30.5632 16.2389 31.55C16.7935 30.5773 17.018 29.4511 16.8788 28.34C16.8788 27.23 16.6988 26.13 16.6288 25.04C16.4822 23.9859 16.6346 22.9117 17.0688 21.94C17.1588 21.76 17.2688 21.58 17.3788 21.4C17.7731 22.0596 18.0854 22.7648 18.3089 23.5C18.58 24.4303 18.7312 25.3914 18.7588 26.36C18.7909 27.3692 18.9147 28.3733 19.1288 29.36C19.2359 29.8496 19.397 30.3258 19.6089 30.78C19.8003 31.24 20.1152 31.638 20.5188 31.93C20.1435 31.6122 19.8632 31.197 19.7088 30.73C19.5354 30.2746 19.4114 29.8019 19.3389 29.32C19.1942 28.3505 19.144 27.3692 19.1888 26.39C19.2269 25.3826 19.1362 24.3744 18.9189 23.39C18.7234 22.4669 18.3861 21.5797 17.9189 20.76C18.1568 20.4785 18.4213 20.2206 18.7088 19.99C18.8774 20.0801 19.051 20.1602 19.2289 20.23L19.7489 20.37C20.3866 20.5874 20.9464 20.9873 21.3589 21.52C21.7891 22.0736 22.1083 22.7052 22.2989 23.38C22.195 22.6564 21.9431 21.9619 21.5589 21.34Z" fill="#263238"/>
                  <path d="M8.3689 22.27C7.86819 22.0395 7.42687 21.6975 7.07886 21.27C6.8226 20.9311 6.64805 20.5375 6.56885 20.12C6.90113 19.8202 7.19959 19.4848 7.45886 19.12C8.16763 18.2136 8.5609 17.1005 8.57886 15.95L7.35889 16.65C7.24786 17.3269 6.98456 17.9697 6.58887 18.53C6.17096 19.1612 5.67356 19.7359 5.10889 20.24C4.32099 20.9055 3.47414 21.498 2.57886 22.01L1.73889 22.46C1.53889 22.57 1.3289 22.67 1.1189 22.77L1.7489 22.63C1.78272 23.1549 1.87321 23.6746 2.01886 24.18C2.22585 24.9211 2.56458 25.6189 3.01886 26.24C3.46313 26.8384 3.95474 27.4002 4.48889 27.92C5.01084 28.4465 5.5874 28.9158 6.20886 29.32C5.63846 28.8563 5.1189 28.3334 4.65887 27.76C4.19453 27.2005 3.77012 26.6091 3.38885 25.99C3.02279 25.3728 2.76887 24.6957 2.63885 23.99C2.52469 23.4547 2.48432 22.9063 2.51886 22.36C2.82886 22.26 3.12889 22.15 3.42889 22.03C4.19684 21.7183 4.92795 21.3225 5.60889 20.85L5.89886 20.63C6.0679 21.0015 6.30152 21.3401 6.58887 21.63C7.03025 22.087 7.57586 22.4301 8.17889 22.63C9.27181 23.0465 10.3259 23.5584 11.3289 24.16C10.4015 23.4416 9.41081 22.809 8.3689 22.27Z" fill="#263238"/>
                </svg>`,
    nama: 'Jantung',
    risk: 'Risiko Sangat Tinggi',
    desc: 'Nikotin dan karbon monoksida bekerja bersama merusak jantung. Nikotin memacu jantung bekerja lebih keras, sementara CO menggantikan oksigen dalam darah, memaksa jantung memompa lebih cepat dengan bahan bakar yang lebih sedikit.',
    stat1Val: '2×', stat1Label: 'Risiko serangan jantung',
    stat2Val: '15%', stat2Label: 'Penurunan oksigen ke jantung',
    dampak: [
      'Penyakit Jantung Koroner — penyempitan arteri koroner',
      'Serangan jantung pada usia lebih muda (bahkan 30-an)',
      'Aritmia (detak jantung tidak teratur) akibat nikotin',
      'Gagal jantung akibat kerja jantung yang terus-menerus berlebihan',
      'Tekanan darah tinggi kronis yang merusak pembuluh darah',
    ]
  },
  lambung: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 43 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.41 9.31999C23.41 11.54 24.66 15.83 25.91 17.22C27.16 18.61 27.71 15.42 32.84 14.72C37.97 14.02 42.96 19.44 41.84 26.79C40.72 34.14 29.51 48.14 20.19 49.52C10.87 50.9 8.95998 39.68 7.84998 38.85C6.73998 38.02 4.65997 47.72 4.65997 47.72L0.5 46.06C0.5 46.06 3.41 35.24 4.94 33.16C6.47 31.08 10.06 31.78 11.04 34.69C12.02 37.6 14.5 38.02 17.41 34.97C20.32 31.92 22.54 23.97 21.16 22.07C19.78 20.17 19.22 8.62 19.22 8.62L18.92 2.62L20.98 0.5L23.28 2.62L23.41 9.31999Z" fill="#808080" stroke="#263238" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
    nama: 'Lambung & Sistem Pencernaan',
    risk: 'Risiko Sedang',
    desc: 'Nikotin melemahkan katup antara kerongkongan dan lambung, menyebabkan asam lambung naik. Rokok juga mengurangi aliran darah ke lambung sehingga memperlambat penyembuhan luka pada dinding lambung.',
    stat1Val: '3×', stat1Label: 'Risiko tukak lambung',
    stat2Val: '60%', stat2Label: 'Lebih lambat sembuh',
    dampak: [
      'Tukak lambung yang sulit sembuh akibat berkurangnya aliran darah',
      'GERD (Asam Lambung Naik) yang kronis dan menyakitkan',
      'Risiko kanker lambung dan kolorektal meningkat signifikan',
      'Mual kronis dan gangguan nafsu makan',
      'Penyerapan vitamin C dan kalsium yang terganggu',
    ]
  },
  ginjal: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 27 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.7442 8.95495C17.7442 8.95495 15.5842 10.365 15.2042 12.085C14.9722 14.076 14.8987 16.0823 14.9842 18.085L15.8842 18.1649C15.8842 18.1649 15.5842 13.7649 15.8842 13.0149C16.1842 12.2649 17.4442 12.2649 17.4442 12.2649C17.957 11.5596 18.2993 10.7449 18.4442 9.88494C18.4942 8.80494 18.7142 8.42495 17.7442 8.95495Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.264 7.45496C17.8234 7.86513 17.3205 8.20268 16.774 8.45496C15.9651 8.62671 15.1323 8.65379 14.314 8.53496L14.384 9.35495C15.0431 9.48107 15.7177 9.50468 16.384 9.42496C17.0974 9.29334 17.7971 9.09583 18.474 8.83496C18.474 8.83496 19.464 7.68496 18.264 7.45496Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.4142 9.92496L14.7642 10.215L14.6143 10.895C15.1833 10.849 15.7551 10.849 16.3242 10.895C17.1442 10.965 18.0443 10.965 18.0443 10.965C18.0443 10.965 19.0942 10.895 18.4142 9.92496Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M24.2341 4.99495C24.2341 4.99495 22.9641 1.11496 20.8741 0.59496C18.7841 0.0749602 15.9541 1.78496 15.8041 3.50496C15.6541 5.22496 18.264 7.45496 18.264 7.45496C17.9771 7.90806 17.7992 8.42149 17.7441 8.95496C17.7591 9.43222 17.833 9.90581 17.9641 10.365C17.2002 11.4106 16.6684 12.6073 16.4041 13.875C16.2541 15.445 17.964 17.235 20.584 17.455C23.204 17.675 24.384 16.115 24.584 14.915C24.6756 14.2994 24.6991 13.6756 24.6541 13.055C25.5798 11.8359 26.0566 10.3348 26.004 8.80495C26.024 5.89495 24.2341 4.99495 24.2341 4.99495Z" fill="#E39292"/>
                  <path opacity="0.58" d="M24.2341 4.99495C24.2341 4.99495 22.9641 1.11496 20.8741 0.59496C18.7841 0.0749602 15.9541 1.78496 15.8041 3.50496C15.6541 5.22496 18.264 7.45496 18.264 7.45496C17.9771 7.90806 17.7992 8.42149 17.7441 8.95496C17.7591 9.43222 17.833 9.90581 17.9641 10.365C17.2002 11.4106 16.6684 12.6073 16.4041 13.875C16.2541 15.445 17.964 17.235 20.584 17.455C23.204 17.675 24.384 16.115 24.584 14.915C24.6756 14.2994 24.6991 13.6756 24.6541 13.055C25.5798 11.8359 26.0566 10.3348 26.004 8.80495C26.024 5.89495 24.2341 4.99495 24.2341 4.99495Z" fill="white"/>
                  <path d="M22.2642 6.04495C22.5981 5.8 22.9093 5.52557 23.1942 5.22496" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M19.4639 7.16495C20.2135 7.05043 20.9375 6.80683 21.6039 6.44495" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.8643 10.595C18.8643 10.595 22.6642 10.215 24.1642 12.455" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M24.2341 4.99495C24.2341 4.99495 22.9641 1.11496 20.8741 0.59496C18.7841 0.0749602 15.9541 1.78496 15.8041 3.50496C15.6541 5.22496 18.264 7.45496 18.264 7.45496C17.9771 7.90806 17.7992 8.42149 17.7441 8.95496C17.7591 9.43222 17.833 9.90581 17.9641 10.365C17.2002 11.4106 16.6684 12.6073 16.4041 13.875C16.2541 15.445 17.964 17.235 20.584 17.455C23.204 17.675 24.384 16.115 24.584 14.915C24.6756 14.2994 24.6991 13.6756 24.6541 13.055C25.5798 11.8359 26.0566 10.3348 26.004 8.80495C26.024 5.89495 24.2341 4.99495 24.2341 4.99495Z" stroke="#263238" stroke-miterlimit="10"/>
                  <path d="M8.76401 8.95495C8.76401 8.95495 10.924 10.365 11.294 12.085C11.5331 14.0754 11.61 16.082 11.524 18.085L10.6241 18.1649C10.6241 18.1649 10.9241 13.7649 10.6241 13.0149C10.3241 12.2649 9.064 12.2649 9.064 12.2649C8.55114 11.5596 8.20885 10.7449 8.064 9.88494C8.014 8.80494 7.79401 8.42495 8.76401 8.95495Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.24408 7.45496C8.68462 7.86513 9.18755 8.20268 9.73407 8.45496C10.5429 8.62671 11.3757 8.65379 12.194 8.53496L12.1141 9.35495C11.4551 9.48236 10.7803 9.50598 10.1141 9.42496C9.40066 9.29334 8.70097 9.09583 8.02404 8.83496C8.02404 8.83496 7.09408 7.68496 8.24408 7.45496Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M8.0939 9.92496L11.7439 10.215L11.8939 10.895C11.3215 10.8489 10.7463 10.8489 10.1739 10.895C9.35392 10.965 8.4639 10.965 8.4639 10.965C8.4639 10.965 7.4139 10.895 8.0939 9.92496Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.27403 4.99495C2.27403 4.99495 3.53407 1.11496 5.62407 0.59496C7.71407 0.0749602 10.554 1.78496 10.704 3.50496C10.854 5.22496 8.24406 7.45496 8.24406 7.45496C8.53098 7.90806 8.70893 8.42149 8.76402 8.95496C8.74819 9.43289 8.67091 9.90679 8.53404 10.365C9.30248 11.4092 9.83788 12.6061 10.104 13.875C10.254 15.445 8.53405 17.235 5.92405 17.455C3.31405 17.675 2.12405 16.115 1.92405 14.915C1.83316 14.2994 1.80633 13.6761 1.84404 13.055C0.924076 11.8334 0.451049 10.3332 0.504009 8.80495C0.484009 5.89495 2.27403 4.99495 2.27403 4.99495Z" fill="#E39292"/>
                  <path opacity="0.58" d="M2.27403 4.99495C2.27403 4.99495 3.53407 1.11496 5.62407 0.59496C7.71407 0.0749602 10.554 1.78496 10.704 3.50496C10.854 5.22496 8.24406 7.45496 8.24406 7.45496C8.53098 7.90806 8.70893 8.42149 8.76402 8.95496C8.74819 9.43289 8.67091 9.90679 8.53404 10.365C9.30248 11.4092 9.83788 12.6061 10.104 13.875C10.254 15.445 8.53405 17.235 5.92405 17.455C3.31405 17.675 2.12405 16.115 1.92405 14.915C1.83316 14.2994 1.80633 13.6761 1.84404 13.055C0.924076 11.8334 0.451049 10.3332 0.504009 8.80495C0.484009 5.89495 2.27403 4.99495 2.27403 4.99495Z" fill="white"/>
                  <path d="M4.24402 6.04495C3.90805 5.80256 3.59652 5.52793 3.31396 5.22496" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.09412 7.16495C6.34453 7.05043 5.62046 6.80683 4.9541 6.44495" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M7.64423 10.595C7.64423 10.595 3.83424 10.215 2.34424 12.455" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2.27403 4.99495C2.27403 4.99495 3.53407 1.11496 5.62407 0.59496C7.71407 0.0749602 10.554 1.78496 10.704 3.50496C10.854 5.22496 8.24406 7.45496 8.24406 7.45496C8.53098 7.90806 8.70893 8.42149 8.76402 8.95496C8.74819 9.43289 8.67091 9.90679 8.53404 10.365C9.30248 11.4092 9.83788 12.6061 10.104 13.875C10.254 15.445 8.53405 17.235 5.92405 17.455C3.31405 17.675 2.12405 16.115 1.92405 14.915C1.83316 14.2994 1.80633 13.6761 1.84404 13.055C0.924076 11.8334 0.451049 10.3332 0.504009 8.80495C0.484009 5.89495 2.27403 4.99495 2.27403 4.99495Z" stroke="#263238" stroke-miterlimit="10"/>
            </svg>`,
    nama: 'Ginjal',
    risk: 'Risiko Sedang-Tinggi',
    desc: 'Ginjal adalah penyaring darah — dan perokok memiliki lebih banyak racun dalam darahnya. Merokok meningkatkan tekanan darah dan merusak pembuluh darah kecil di ginjal, mengurangi kemampuan filterasi secara perlahan.',
    stat1Val: '50%', stat1Label: 'Risiko gagal ginjal lebih tinggi',
    stat2Val: '3×', stat2Label: 'Risiko kanker ginjal',
    dampak: [
      'Penyakit ginjal kronis akibat tekanan darah tinggi yang tidak terkontrol',
      'Kanker ginjal — perokok memiliki risiko 3× lebih tinggi',
      'Proteinuria (kebocoran protein) tanda kerusakan ginjal dini',
      'Gagal ginjal yang membutuhkan dialisis atau transplantasi',
      'Batu ginjal lebih sering terbentuk pada perokok',
    ]
  },
  mulut: {
    emoji: `<svg width="40" height="auto" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.33 2.80225C11.4547 1.61813 10.1911 0.779258 8.76001 0.432235C6.58001 0.0322355 3.76 0.232238 2.03 1.62224L0.25 3.00224C0.25 3.00224 1.25001 6.17224 4.01001 7.00224C4.97292 7.35326 5.99838 7.49986 7.02107 7.43271C8.04376 7.36556 9.04126 7.08614 9.95001 6.61224C11.73 5.78224 12.33 2.80225 12.33 2.80225Z" fill="white" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.33 2.80225C6.78 4.59225 0.25 3.00224 0.25 3.00224L12.33 2.80225Z" fill="white"/>
                  <path d="M12.33 2.80225C6.78 4.59225 0.25 3.00224 0.25 3.00224" stroke="#263238" stroke-width="0.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
    nama: 'Kulit, Gigi & mulut',
    risk: 'Risiko Terlihat',
    desc: 'Dampak rokok pada penampilan adalah yang paling terlihat secara langsung. Nikotin menyempitkan pembuluh darah kulit, mengurangi pasokan oksigen, dan mempercepat penuaan. Tar menodai gigi dan mulut secara permanen.',
    stat1Val: '10 thn', stat1Label: 'Kulit terlihat lebih tua',
    stat2Val: '5×', stat2Label: 'Risiko kanker mulut',
    dampak: [
      'Penuaan dini: kerutan dalam dan warna kulit kusam, keabu-abuan',
      'Gigi kuning-coklat dan bau mulut yang sulit dihilangkan',
      'Kanker mulut, lidah, dan tenggorokan',
      'Penyakit gusi (periodontitis) yang menyebabkan gigi tanggal',
      'Rambut rontok lebih cepat dan kuku rapuh akibat kekurangan oksigen',
    ]
  }
};

/**
 * Tampilkan informasi organ di panel
 * @param {string} organKey - kunci organ (otak, paru, jantung, dll)
 */
function showOrganInfo(organKey) {
  const data = organData[organKey];
  if (!data) return;

  // Sembunyikan panel default, tampilkan panel konten
  document.getElementById('organInfoDefault').style.display = 'none';
  const content = document.getElementById('organInfoContent');
  content.style.display = 'block';

  // Isi konten organ
  document.getElementById('organEmoji').innerHTML    = data.emoji;
  document.getElementById('organNama').innerHTML     = data.nama;
  document.getElementById('organRisk').innerHTML     = data.risk;
  document.getElementById('organDesc').innerHTML     = data.desc;
  document.getElementById('ostat1Val').innerHTML     = data.stat1Val;
  document.getElementById('ostat1Label').innerHTML   = data.stat1Label;
  document.getElementById('ostat2Val').innerHTML     = data.stat2Val;
  document.getElementById('ostat2Label').innerHTML   = data.stat2Label;

  // Isi daftar dampak
  const dampakList = document.getElementById('organDampakList');
  dampakList.innerHTML = data.dampak.map(d => `<li>${d}</li>`).join('');

  // Scroll ke panel info di mobile
  if (window.innerWidth < 1024) {
    document.getElementById('organInfoPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

/**
 * Reset panel organ ke tampilan default
 */
function resetOrganInfo() {
  document.getElementById('organInfoDefault').style.display = 'block';
  document.getElementById('organInfoContent').style.display = 'none';
}

// Tambahkan event listener ke setiap organ-group di SVG
document.querySelectorAll('.organ-group').forEach(group => {
  const organKey = group.getAttribute('data-organ');

  // Event klik
  group.addEventListener('click', () => {
    showOrganInfo(organKey);
  });

  // Event keyboard (untuk aksesibilitas)
  group.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      showOrganInfo(organKey);
    }
  });
});

// ============================================================
// 4. VIDEO PLAYER
// ============================================================

/**
 * Ganti thumbnail dengan iframe YouTube saat tombol play diklik
 * @param {HTMLElement} thumbEl - elemen thumbnail yang diklik
 * @param {string} iframeSrc - URL embed YouTube dengan ?autoplay=1
 */
function playVideo(thumbEl, iframeSrc) {
  // Buat container iframe
  const container = document.createElement('div');
  container.className = 'video-iframe-container';

  // Buat iframe
  const iframe = document.createElement('iframe');
  iframe.src = iframeSrc;
  iframe.allowFullscreen = true;
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.title = 'Video Edukasi Bahaya Merokok';

  container.appendChild(iframe);

  // Ganti elemen thumbnail dengan iframe
  thumbEl.parentNode.replaceChild(container, thumbEl);
}

// ============================================================
// 5. FILTER ARTIKEL
// ============================================================

/**
 * Filter artikel berdasarkan kategori
 * @param {string} kategori - kategori yang dipilih ('semua', 'kesehatan', 'finansial', 'berhenti')
 * @param {HTMLElement} btnEl - tombol filter yang diklik
 */
function filterArtikel(kategori, btnEl) {
  // Update tampilan tombol aktif
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  btnEl.classList.add('active');

  // Filter kartu artikel
  document.querySelectorAll('.artikel-card').forEach(card => {
    if (kategori === 'semua' || card.getAttribute('data-cat') === kategori) {
      // Tampilkan dengan animasi
      card.style.display = 'flex';
      card.style.animation = 'fadeUp 0.4s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

// ============================================================
// 6. TOGGLE ARTIKEL LENGKAP (Expand/Collapse)
// ============================================================

/**
 * Toggle tampilan artikel lengkap
 * @param {HTMLElement} btn - tombol baca yang diklik
 */
function toggleArtikelFull(btn) {
  const artikelBody = btn.closest(".artikel-body");
  const full = artikelBody.querySelector(".artikel-full");
  const selanjutnyaBtn = artikelBody.querySelector(".btn-selanjutnya");
  const tutupBtn = artikelBody.querySelector(".btn-tutup-footer");

  if (!full) return;

  if (full.classList.contains("show")) {
    full.classList.remove("show");
    full.scrollTop = 0;

    if (selanjutnyaBtn) {
      selanjutnyaBtn.style.display = "inline";
    }

    if (tutupBtn) {
      tutupBtn.style.display = "none";
    }
  } else {
    full.classList.add("show");

    if (selanjutnyaBtn) {
      selanjutnyaBtn.style.display = "none";
    }

    if (tutupBtn) {
      tutupBtn.style.display = "inline-flex";
    }
  }
}

// ============================================================
// 7. INTERSECTION OBSERVER: Animasi Elemen Saat Scroll
// ============================================================

/**
 * Tambahkan class 'fade-in' ke elemen yang ingin dianimasi,
 * lalu Observer akan menambahkan 'visible' saat elemen masuk viewport
 */
const fadeElements = document.querySelectorAll(
  '.hasil-card, .artikel-card, .video-card, .kalk-input-panel, .kalk-hasil-panel, .organ-info-panel, .rt-item'
);

fadeElements.forEach(el => {
  el.classList.add('fade-in');
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Staggered delay berdasarkan urutan
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
});

fadeElements.forEach(el => observer.observe(el));

// ============================================================
// 8. SMOOTH SCROLL UNTUK ANCHOR LINKS
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // 1. SMOOTH SCROLL NAVBAR
  // ==============================
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();

        const offset = target.getBoundingClientRect().top + window.scrollY - 80;

        window.scrollTo({
          top: offset,
          behavior: 'smooth'
        });
      }
    });
  });

  // ==============================
  // 2. ANIMASI SCROLL (MUNCUL DARI BAWAH)
  // ==============================
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, {
    threshold: 0.3
  });

  const target = document.querySelector('.body-illustration');
  if (target) observer.observe(target);

});



// ============================================================
// 9. HIGHLIGHT AKTIF NAVBAR BERDASARKAN POSISI SCROLL
// ============================================================

const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navAnchors.forEach(a => {
    a.style.color = '';
    if (a.getAttribute('href') === `#${current}`) {
      a.style.color = 'var(--clr-primary)';
    }
  });
});

// ============================================================
// 10. INTERAKTIVITAS TAMBAHAN: Kalkulator input real-time
// ============================================================

// Update kalkulator setiap kali input berubah
['hargaBungkus', 'batangPerBungkus'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', hitungKalkulator);
});

// ============================================================
// 11. EFEK SUARA (AUDIO FEEDBACK)
// ============================================================

// Menggunakan aset suara gratis dari Google Actions
const sfxHeartbeat = new Audio('https://actions.google.com/sounds/v1/human_voices/heartbeat.ogg');
const sfxCough = new Audio('https://actions.google.com/sounds/v1/human_voices/male_cough.ogg');
const sfxCoins = new Audio('https://actions.google.com/sounds/v1/office/coins_clinking.ogg');

sfxHeartbeat.volume = 0.6;
sfxHeartbeat.loop = true; // Jantung berdetak berulang saat di-hover
sfxCough.volume = 0.8;
sfxCoins.volume = 0.6;

// Fungsi untuk memainkan suara dengan aman (mencegah error autoplay browser)
function playSound(audioEl) {
  audioEl.currentTime = 0;
  audioEl.play().catch(err => {
    console.warn("Browser mencegah pemutaran audio otomatis. User harus berinteraksi (klik) di halaman terlebih dahulu.", err);
  });
}

function stopSound(audioEl) {
  audioEl.pause();
  audioEl.currentTime = 0;
}

// 1. Suara Koin pada tombol Kalkulator
const btnHitung = document.querySelector('.btn-hitung');
if (btnHitung) {
  // Tambahkan event listener tanpa mengganggu onclick bawaan HTML
  btnHitung.addEventListener('click', () => {
    playSound(sfxCoins);
  });
}

// 2. Suara Paru-paru & Jantung saat Hover Peta Tubuh
document.querySelectorAll('.organ-group').forEach(group => {
  const organKey = group.getAttribute('data-organ');

  group.addEventListener('mouseenter', () => {
    if (organKey === 'jantung') {
      playSound(sfxHeartbeat);
    } else if (organKey === 'paru') {
      playSound(sfxCough);
    }
  });

  group.addEventListener('mouseleave', () => {
    if (organKey === 'jantung') {
      stopSound(sfxHeartbeat); // Matikan suara jantung saat cursor keluar
    }
  });
});

// ============================================================
// 12. LOG SELAMAT DATANG DI CONSOLE
// ============================================================
console.log('%c🚭 BerhentiSekarang', 'color:#c0392b;font-size:20px;font-weight:bold;font-family:serif;');
console.log('%cWebsite Edukasi Bahaya Merokok | Tugas Multimedia', 'color:#27ae60;font-size:12px;');
console.log('%cStack: HTML5 + CSS3 + Vanilla JavaScript | No Framework', 'color:#888;font-size:11px;');
