document.addEventListener("DOMContentLoaded", function () {
  const tombolTambah = document.getElementById("tombol-tambah");
  const inputContainer = document.querySelector(".input-container");
  const toggleTabel = document.getElementById("toggle-tabel");
  const tableContainer = document.querySelector(".table-container");
  const tambahKata = document.getElementById("tambah-kata");
  const kataDaerahInput = document.getElementById("kata-daerah");
  const kataIndonesiaInput = document.getElementById("kata-indonesia");
  const kamusTable = document
    .getElementById("kamus-table")
    .querySelector("tbody");

  // Ambil data dari local storage saat halaman dimuat
  let dataKamus = JSON.parse(localStorage.getItem("kamusData")) || [];

  // Fungsi untuk menyimpan data ke local storage
  function simpanKeLocalStorage() {
    localStorage.setItem("kamusData", JSON.stringify(dataKamus));
  }

  // fungsi untuk mengurutkan data berdasarkan abjad
  function urutkanData() {
    dataKamus.sort((a, b) =>
      a.kataDaerah.localeCompare(b.kataDaerah, "id", { sensitivity: "base" })
    );
  }

  // Fungsi untuk menampilkan data di tabel
  function tampilkanData() {
    kamusTable.innerHTML = ""; // Kosongkan isi tabel sebelum menambahkan data baru
    urutkanData();

    dataKamus.forEach((item, index) => {
      const row = document.createElement("tr");

      row.innerHTML = `
          
      <td>${index + 1}</td>
      <td>${item.kataDaerah}</td>
          <td>${item.kataIndonesia}</td>
          <td><button class="hapus" data-index="${index}">Hapus</button></td>
        `;

      kamusTable.appendChild(row);
    });

    // Tambahkan event listener untuk tombol hapus
    document.querySelectorAll(".hapus").forEach((button) => {
      button.addEventListener("click", function () {
        const index = this.getAttribute("data-index");
        dataKamus.splice(index, 1);
        simpanKeLocalStorage();
        tampilkanData();
      });
    });
  }

  // Tombol tambah input
  tombolTambah.addEventListener("click", () => {
    inputContainer.classList.toggle("show");
  });

  // Tombol toggle tabel
  toggleTabel.addEventListener("click", () => {
    tableContainer.classList.toggle("show");

    // Ubah ikon mata saat diklik
    toggleTabel.textContent = tableContainer.classList.contains("show")
      ? "🙈"
      : "👁️";
  });

  // Tombol tambah kata ke tabel
  tambahKata.addEventListener("click", function () {
    const kataDaerah = kataDaerahInput.value.trim();
    const kataIndonesia = kataIndonesiaInput.value.trim();

    if (kataDaerah === "" || kataIndonesia === "") {
      alert("Silakan isi kedua kolom sebelum menambahkan!");
      return;
    }

    // Cek apakah kata sudah ada dalam kamus
    const sudahAda = dataKamus.some(
      (item) =>
        item.kataDaerah.toLowerCase() === kataDaerah.toLowerCase() &&
        item.kataIndonesia.toLowerCase() === kataIndonesia.toLowerCase()
    );

    if (sudahAda) {
      alert("Kata ini sudah ada dalam kamus!");
      return;
    }

    // Tambahkan data ke array
    dataKamus.push({ kataDaerah, kataIndonesia });

    // urutkan data sebelum menyimpan ke local storage
    urutkanData();

    // Simpan ke local storage
    simpanKeLocalStorage();

    // Perbarui tampilan tabel
    tampilkanData();

    // Kosongkan input setelah ditambahkan
    kataDaerahInput.value = "";
    kataIndonesiaInput.value = "";
  });

  // Tampilkan data dari local storage saat pertama kali halaman dibuka
  tampilkanData();
});

// Bagian pencarian
document.addEventListener("DOMContentLoaded", function () {
  const cariInput = document.getElementById("cari-belitung");
  const hasilTerjemahan = document.getElementById("hasil-terjemahan");
  const clearSearch = document.getElementById("clear-search");

  // Ambil data dari local storage
  let dataKamus = JSON.parse(localStorage.getItem("kamusData")) || [];

  // Fungsi mencari kata dalam kamus
  function cariTerjemahan() {
    const query = cariInput.value.trim().toLowerCase();
    if (query === "") {
      hasilTerjemahan.textContent = "Terjemahan akan muncul di sini...";
      return;
    }

    const hasil = dataKamus.filter(
      (item) =>
        item.kataDaerah.toLowerCase().includes(query) ||
        item.kataIndonesia.toLowerCase().includes(query)
    );

    if (hasil.length > 0) {
      hasilTerjemahan.innerHTML = hasil
        .map((item) => `👉 ${item.kataDaerah} = ${item.kataIndonesia}`)
        .join("<br>");
    } else {
      hasilTerjemahan.textContent = "❌ Kata tidak ditemukan";
    }
  }

  // Event saat mengetik di input pencarian
  cariInput.addEventListener("input", cariTerjemahan);

  // Tombol hapus input
  clearSearch.addEventListener("click", function () {
    cariInput.value = "";
    hasilTerjemahan.textContent = "Terjemahan akan muncul di sini...";
  });
});
