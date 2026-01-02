import { CONFIG } from "./config.js";
import { loadProducts } from "./services/apiService.js";
import { renderProductGrid } from "./components/productGrid.js";
import { loadPartial, updateHotlineNumber } from "./utils/domHelper.js";

const PAGE_SIZE = 15;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let isLoading = false;

document.addEventListener("DOMContentLoaded", async () => {
  await loadPartial("navbar", "partials/navbar.html");
  updateHotlineNumber(CONFIG.WHATSAPP_NUMBER);

  allProducts = await loadProducts();
  filteredProducts = [...allProducts];

  loadUntilScrollable();

  // SEARCH BY NAME ONLY
  document.addEventListener("input", e => {
    if (e.target.id === "searchProduk") {
      const keyword = e.target.value.trim().toLowerCase();

      filteredProducts = allProducts.filter(p =>
          p.nama.toLowerCase().includes(keyword)
      );

      resetAndLoad();
    }
  });

  window.addEventListener("scroll", handleScroll);
});

/* =====================
   CORE FUNCTIONS
===================== */

function resetAndLoad() {
  currentPage = 1;
  document.getElementById("product-grid").innerHTML = "";
  loadUntilScrollable();
}

function loadUntilScrollable() {
  showLoader();

  while (
      (document.body.scrollHeight <= window.innerHeight) &&
      hasMoreData()
      ) {
    loadNextPage();
  }

  hideLoader();
}

function loadNextPage() {
  if (isLoading || !hasMoreData()) return;

  isLoading = true;
  showLoader();

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, end);

  renderProductGrid(pageItems, true);
  currentPage++;

  isLoading = false;
  hideLoader();
}

function handleScroll() {
  const nearBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 200;

  if (nearBottom) {
    loadNextPage();
  }
}

function hasMoreData() {
  return (currentPage - 1) * PAGE_SIZE < filteredProducts.length;
}

/* =====================
   LOADER UI
===================== */

function showLoader() {
  document.getElementById("loader")?.classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("loader")?.classList.add("d-none");
}
