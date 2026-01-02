export function initFilterDialog({
                                     products,
                                     onApply
                                 }) {
    initCategoryOptions(products);

    document.getElementById("applyFilter")
        .addEventListener("click", () => {
            const filter = {
                kategori: document.getElementById("filterKategori").value,
                priceFrom: Number(document.getElementById("priceFrom").value) || null,
                priceTo: Number(document.getElementById("priceTo").value) || null
            };
            onApply(filter);
        });

    document.getElementById("resetFilter")
        .addEventListener("click", () => {
            resetUI();
            onApply({});
        });
}

/* ======================
   HELPER FUNCTIONS
====================== */

function initCategoryOptions(products) {
    const select = document.getElementById("filterKategori");
    if (!select) return; // ⬅️ SAFETY
    const categories = [...new Set(
        products.map(p => p.kategori).filter(Boolean)
    )];

    categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
    });
}

function resetUI() {
    document.getElementById("filterKategori").value = "";
    document.getElementById("priceFrom").value = "";
    document.getElementById("priceTo").value = "";
}
