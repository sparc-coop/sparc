var productId;
function initCatalog(dotnetReference) {
    document.addEventListener('mouseover', (e) => {
        var t = e.target;

        if (t.closest(".product-card") || t.closest(".card-overlay")) {
            console.log("hovered on product card: " + t.getAttribute("data-id"));
            productId = t.getAttribute("data-id");
            hoverProduct(dotnetReference);
        }
    });

    document.addEventListener('click', (e) => {
        var t = e.target;

        if (t.closest(".product-card") || t.closest(".card-overlay")) {
            console.log("clicked on product card: " + t.getAttribute("data-id"));
            productId = t.getAttribute("data-id");
            selectProduct(dotnetReference);
        }
    });
}

function hoverProduct(dotnetReference) {
    dotnetReference.invokeMethodAsync('OnHoverProduct', productId);
}

function selectProduct(dotnetReference) {
    dotnetReference.invokeMethodAsync('OnSelectProduct', productId);
}