import { CONFIG } from "./config.js";
import { loadProducts } from "./services/apiService.js";
import { renderProductGrid } from "./components/productGrid.js";
import { loadPartial, updateHotlineNumber } from "./utils/domHelper.js";
import { initFilterDialog } from "./components/filterDialog.js";
import { renderHero } from "./components/hero.js";

renderHero();

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

document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  try {
    showLoader();

    const [_, __, ___, products] = await Promise.all([
      loadPartial("navbar", "partials/navbar.html"),
      loadPartial("filterDialog", "partials/filter-dialog.html"),
      loadPartial("contact-footer", "partials/contact-footer.html"), // 🔥 FIX
      loadProducts()
    ]);

    updateHotlineNumber(CONFIG.WHATSAPP_NUMBER);

    allProducts = products;
    filteredProducts = [...allProducts];

    initFilterDialog({
      products: allProducts,
      onApply: filter => {
        currentFilter.kategori = filter.kategori || "";
        currentFilter.priceFrom = filter.priceFrom ?? null;
        currentFilter.priceTo = filter.priceTo ?? null;
        applyAllFilters();
      },
      onReset: () => {
        currentFilter.kategori = "";
        currentFilter.priceFrom = null;
        currentFilter.priceTo = null;
        document.getElementById('searchProduk').value = '';
        currentFilter.keyword = '';
        applyAllFilters();
      }
    });

    loadFirstPage();

    document.addEventListener("input", e => {
      if (e.target.id === "searchProduk") {
        currentFilter.keyword = e.target.value.trim().toLowerCase();
        applyAllFilters();
      }
    });

  } catch (err) {
    console.error("Init error:", err);
  } finally {
    hideLoader();
  }
}

/* =====================
   FILTER CORE
===================== */

function updateFilterBadge() {
  const badge = document.getElementById('filterBadge');
  if (!badge) return;

  const activeFilters = [
    currentFilter.kategori ? 1 : 0,
    currentFilter.priceFrom ? 1 : 0,
    currentFilter.priceTo ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  if (activeFilters > 0) {
    badge.textContent = activeFilters;
    badge.classList.remove('d-none');
  } else {
    badge.classList.add('d-none');
  }
}

function applyAllFilters() {
  filteredProducts = allProducts.filter(p => {

    if (
        currentFilter.keyword &&
        !p.nama.toLowerCase().includes(currentFilter.keyword)
    ) return false;

    if (
        currentFilter.kategori &&
        p.kategori !== currentFilter.kategori
    ) return false;

    if (
        currentFilter.priceFrom !== null &&
        p.harga < currentFilter.priceFrom
    ) return false;

    if (
        currentFilter.priceTo !== null &&
        p.harga > currentFilter.priceTo
    ) return false;

    return true;
  });

  updateFilterBadge();
  resetAndLoad();
}

/* =====================
   PAGINATION
===================== */

function resetAndLoad() {
  currentPage = 1;
  document.getElementById("product-grid").innerHTML = "";
  loadFirstPage();
}

async function loadFirstPage() {
  if (filteredProducts.length === 0) return;

  showLoader();

  const pageItems = filteredProducts.slice(0, PAGE_SIZE);

  renderProductGrid(pageItems, false);

  currentPage = 2;

  /* Aktifkan infinite scroll */
  window.addEventListener('scroll', handleScroll);

  hideLoader();
}

async function loadNextPage() {
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

let scrollLock = false;

function handleScroll() {
  if (scrollLock) return;
  scrollLock = true;

  const nearBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 400;

  if (nearBottom) {
    loadNextPage();
  }

  setTimeout(() => {
    scrollLock = false;
  }, 200);
}

function hasMoreData() {
  return (currentPage - 1) * PAGE_SIZE < filteredProducts.length;
}

/* =====================
   LOADER
===================== */

function showLoader() {
  const loader = document.getElementById("loader");
  if (!loader) return;

  loader.style.display = 'flex';
  loader.style.justifyContent = 'center';
  loader.style.alignItems = 'center';
  loader.style.gap = '0.5rem';
  loader.style.minHeight = '50px';
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = 'none';
}
