export function renderHero() {
    document.getElementById("hero").innerHTML = `
    <section class="hero-industrial">
      <h1>PT. <span>HANIF PERSADA</span> PUTRA</h1>

      <p class="hero-desc">
        Penyedia terpercaya suku cadang berkualitas untuk Alat Berat,
        Kontainer, dan Truck besar di Indonesia.
        Mendukung kelancaran logistik dan industri nasional.
      </p>

      <div class="hero-cta">
        <a href="#katalog" class="btn-order">LIHAT PRODUK</a>
        <a href="#lokasi" class="btn-order">KUNJUNGI KAMI</a>
      </div>
    </section>
  `;
}
