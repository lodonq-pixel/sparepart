import { loadProducts } from "./services/apiService.js";
import { renderProductGrid } from "./components/productGrid.js";
import { loadPartial } from "./utils/domHelper.js";

let allProducts = [];

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("navbar", "partials/navbar.html");

  allProducts = await loadProducts();
  renderProductGrid(allProducts);

  // SEARCH BY NAME ONLY
  document.addEventListener("input", e => {
    if (e.target.id === "searchProduk") {
      const keyword = e.target.value.trim().toLowerCase();

      const filtered = allProducts.filter(p =>
          p.nama.toLowerCase().includes(keyword)
      );

      renderProductGrid(filtered);
    }
  });
});
