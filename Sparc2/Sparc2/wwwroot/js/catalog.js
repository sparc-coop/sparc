var productId;
var tabId;

function initCatalog(dotnetReference) {
    document.addEventListener('mouseover', (e) => {
        var t = e.target;

        if (t.closest(".product")) {
            console.log("hovered on product card: " + t.getAttribute("data-id"));
            productId = t.getAttribute("data-id");
            hoverProduct(dotnetReference);
        }
    });

    document.addEventListener('click', (e) => {
        var t = e.target;

        if (t.closest(".product")) {
            //console.log("clicked on product card: " + t.getAttribute("data-id"));
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

function initProductActions(dotnetReference) {
    document.addEventListener('mouseover', (e) => {
        var t = e.target;

        if (t.closest(".product-tab")) {
            //console.log("hovered on product tab: " + t.getAttribute("id"));
            var tab = t.closest(".product-tab");
            if (!tab.classList.contains("clicked")) {
                tab.classList.add("hovered");
            }
            //hoverProductButton(dotnetReference, tab);
        }
    });

    document.addEventListener('mouseout', (e) => {
        var t = e.target;

        if (t.closest(".product-tab")) {
            //console.log("hovered on product tab: " + t.getAttribute("id"));
            var tab = t.closest(".product-tab");
            if (tab.classList.contains("hovered"))
            {
                tab.classList.remove("hovered");
            }
        }
    });

    document.addEventListener('click', (e) => {
        var t = e.target;

        if (t.closest(".product-tab")) {
            console.log("clicked on product tab: " + t.getAttribute("id"));
            var tab = t.closest(".product-tab");

            if (tab.classList.contains("clicked")) {
                tab.classList.remove("clicked");
                clickProductTab(dotnetReference);
            } else {
                var activeTabs = document.querySelectorAll(".product-tab");

                activeTabs.forEach((tab) => {
                    tab.classList.remove("hovered");
                    tab.classList.remove("clicked");
                });

                tab.classList.add("clicked");
                tabId = tab.getAttribute("id");
                clickProductTab(dotnetReference);
            }
        }
    });
}

function clickProductTab(dotnetReference) {
    dotnetReference.invokeMethodAsync('OnClickTab', tabId);
}

function replaceURL(obj, url) {
    history.replaceState(obj, "", url);
}