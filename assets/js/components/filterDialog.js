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

    const resetButton = document.getElementById("resetFilter");
    const modal = document.getElementById("filterModal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    
    resetButton.addEventListener("click", () => {
        resetUI();
        onApply({});
        
        // Close the modal after a short delay to show the reset action
        setTimeout(() => {
            if (modalInstance) {
                modalInstance.hide();
            } else if (typeof bootstrap !== 'undefined') {
                // Fallback in case instance isn't available
                const bsModal = new bootstrap.Modal(modal);
                bsModal.hide();
            }
        }, 300);
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
