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

  // Initial load - show first page immediately
  loadFirstPage();

  // Search by name only
  document.addEventListener("input", e => {
    if (e.target.id === "searchProduk") {
      currentFilter.keyword = e.target.value.trim().toLowerCase();
      applyAllFilters();
    }
  });

  // Infinite scroll will be enabled after first page load
});

/* =====================
   FILTER & SEARCH CORE
===================== */

function updateFilterBadge() {
  const badge = document.getElementById('filterBadge');
  if (!badge) return;

  const activeFilters = [
    currentFilter.kategori ? 1 : 0,
    currentFilter.priceFrom ? 1 : 0,
    currentFilter.priceTo ? 1 : 0,
    currentFilter.keyword ? 1 : 0
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

  updateFilterBadge();
  resetAndLoad();
}

/* =====================
   PAGINATION / LAZY LOAD
===================== */

function resetAndLoad() {
  currentPage = 1;
  document.getElementById("product-grid").innerHTML = "";
  loadFirstPage();
}

async function loadFirstPage() {
  if (filteredProducts.length === 0) return;
  
  showLoader();
  
  // Load just the first page
  const start = 0;
  const end = PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, end);
  
  // Render the first page (not in append mode)
  renderProductGrid(pageItems, false);
  
  currentPage = 2; // Set to next page for lazy loading
  
  // Enable scroll listener after first page is loaded
  window.addEventListener('scroll', handleScroll, { once: true });
  
  hideLoader();
}

async function loadNextPage() {
  if (isLoading || !hasMoreData()) return;

  isLoading = true;
  showLoader();

  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = filteredProducts.slice(start, end);

  // Append to existing products
  renderProductGrid(pageItems, true);

  currentPage++;
  isLoading = false;
  hideLoader();
}

let isScrolling = false;

function handleScroll() {
  if (isScrolling) return;
  
  isScrolling = true;
  
  const nearBottom =
      window.innerHeight + window.scrollY >=
      document.body.offsetHeight - 500; // Increased threshold for better UX

  if (nearBottom && hasMoreData()) {
    loadNextPage();
  }
  
  // Throttle the scroll event
  setTimeout(() => {
    isScrolling = false;
  }, 200);
}

function hasMoreData() {
  return (currentPage - 1) * PAGE_SIZE < filteredProducts.length;
}

/* =====================
   LOADER UI
===================== */

function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.gap = '0.5rem';
    loader.style.minHeight = '50px';
  }
}

function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = 'none';
  }
}
