function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { 
        style: 'currency', 
        currency: 'IDR', 
        maximumFractionDigits: 0 
    }).format(amount);
}

// Main application code
const PATH = "https://script.google.com/macros/s/AKfycbyNuM2rlMKRrvTaUHZEvZCFOLbg1TAcdnrAPCxnIoq75GFSOi5rJ-DfUlP8iFpT6DGnQA/exec";
const API = PATH + "?type=produk";
const WA = "628998765974"; // nomor WA admin

fetch(API)
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("produk");

        data.forEach(p => {
            const pesan = encodeURIComponent(
                `Halo admin,
Saya ingin pesan:
${p.nama}
Harga: ${formatCurrency(p.harga)}
Mohon info ketersediaan.`
            );

            container.innerHTML += `
<div class="col-md-3 mb-4">
  <div class="card h-100">
    <img src="${p.gambar}" alt="">
    <div class="card-body">
      <h6>${p.nama}</h6>
      <p class="text-danger fw-bold">${formatCurrency(p.harga)}</p>
      <p>Stok: ${p.stok}</p>
      <a target="_blank"
         href="https://wa.me/${WA}?text=${pesan}"
         class="btn btn-success w-100">
         Order WhatsApp
      </a>
    </div>
  </div>
</div>`;
        });
    });
