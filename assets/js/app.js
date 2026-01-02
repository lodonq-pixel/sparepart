import { CONFIG } from "./config.js";
import { loadProducts } from "./services/apiService.js";
import { renderProductGrid } from "./components/productGrid.js";
import { loadPartial, updateHotlineNumber } from "./utils/domHelper.js";
import { initFilterDialog } from "./components/filterDialog.js";

/* =====================
   CONSTANTS & STATE
===================== */

const PAGE_SIZE = 15;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let isLoading = false;

let currentFilter = {
  keyword: "",
  kategori: "",
  priceFrom: null,
  priceTo: null
};

/* =====================
   INIT APP
===================== */

document.addEventListener("DOMContentLoaded", async () => {
  // Load UI partials
  await loadPartial("navbar", "partials/navbar.html");
  await loadPartial("filterDialog", "partials/filter-dialog.html");

  updateHotlineNumber(CONFIG.WHATSAPP_NUMBER);

  // Load data
  allProducts = await loadProducts();
  filteredProducts = [...allProducts];

  // Init filter dialog component
  initFilterDialog({
    products: allProducts,
    onApply: filter => {
      currentFilter.kategori = filter.kategori || "";
      currentFilter.priceFrom = filter.priceFrom ?? null;
      currentFilter.priceTo = filter.priceTo ?? null;
      applyAllFilters();
    }
  });

  // Initial load
  loadUntilScrollable();

  // Search by name only
  document.addEventListener("input", e => {
    if (e.target.id === "searchProduk") {
      currentFilter.keyword = e.target.value.trim().toLowerCase();
      applyAllFilters();
    }
  });

  // Infinite scroll
  window.addEventListener("scroll", handleScroll);
});

/* =====================
   FILTER & SEARCH CORE
===================== */

function applyAllFilters() {
  filteredProducts = allProducts.filter(p => {
    // Search by name
    if (
        currentFilter.keyword &&
        !p.nama.toLowerCase().includes(currentFilter.keyword)
    ) return false;

    // Filter by category
    if (
        currentFilter.kategori &&
        p.kategori !== currentFilter.kategori
    ) return false;

    // Filter by price from
    if (
        currentFilter.priceFrom !== null &&
        p.harga < currentFilter.priceFrom
    ) return false;

    // Filter by price to
    if (
        currentFilter.priceTo !== null &&
        p.harga > currentFilter.priceTo
    ) return false;

    return true;
  });

  resetAndLoad();
}

/* =====================
   PAGINATION / LAZY LOAD
===================== */

function resetAndLoad() {
  currentPage = 1;
  document.getElementById("product-grid").innerHTML = "";
  loadUntilScrollable();
}

function loadUntilScrollable() {
  showLoader();

  while (
      document.body.scrollHeight <= window.innerHeight &&
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

  // append mode
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
  document.getElementById("loader")
      ?.classList.remove("d-none");
}

function hideLoader() {
  document.getElementById("loader")
      ?.classList.add("d-none");
}
