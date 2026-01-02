import { CONFIG } from "../config.js";

export async function loadProducts() {
  const res = await fetch(`${CONFIG.API_BASE_URL}?type=produk`);
  return res.json();
}

export async function loadCategories() {
  const res = await fetch(`${CONFIG.API_BASE_URL}?type=kategori`);
  return res.json();
}