document.addEventListener("input", e => {
    if (e.target.id === "searchProduk") {
        keyword = e.target.value.toLowerCase();
        applyFilter();
    }
});
