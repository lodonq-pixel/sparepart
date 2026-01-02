import { CONFIG } from "../config.js";
import {formatCurrency} from "../utils/currency.js";

export function renderProductGrid(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(p => {
    const msg = encodeURIComponent(`Halo admin, saya ingin pesan ${p.nama}`);
    grid.innerHTML += `
      <div class="col-6 col-md-4 col-lg-3">
        <div class="card shadow-sm h-100">
          <img src="${p.gambar}" class="card-img-top">
          <div class="card-body p-2">
            <div class="small">${p.nama}</div>
            <div class="price">${formatCurrency(p.harga)}</div>
          </div>
          <div class="card-footer">
            <a href="https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${msg}"
               target="_blank"
               class="btn-order w-100 text-center text-decoration-none">
              ORDER
            </a>
          </div>
        </div>
      </div>`;
  });
}