export function renderHero() {
    document.getElementById("hero").innerHTML = `
    <section class="hero">
      <h1>PT. <span>HANIF PERSADA</span> PUTRA</h1>

      <p class="hero-desc">
        Penyedia Suku Cadang Terpercaya untuk Alat Berat, Kontainer, dan Truk Besar. 
        Menjadi bagian dari roda penggerak ekonomi Indonesia, kami menyediakan komponen berkualitas yang dirancang untuk performa maksimal di medan terberat sekalipun. 
        Dedikasi kami adalah memastikan kelancaran logistik nasional melalui distribusi suku cadang yang cepat, tepat, dan terjamin kualitasnya.
      </p>

      <div class="hero-btn">
        <a href="#katalog" class="btn-order">LIHAT PRODUK</a>
        <a href="#lokasi" class="btn-order">KUNJUNGI KAMI</a>
      </div>
    </section>
  `;
}
