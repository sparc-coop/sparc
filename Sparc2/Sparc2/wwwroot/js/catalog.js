var productId;
var tabId;

function initCatalog(dotnetReference) {
    document.addEventListener('mouseover', (e) => {
        var t = e.target;

        if (t.closest(".product")) {
            //console.log("hovered on product card: " + t.getAttribute("data-id"));
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
    //history.replaceState(obj, "", url);
    window.history.back();
}

function hoverProductInView(dotnetReference, productId) {
    const card = document.getElementById(productId);
    let rect = card.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    let visibleHeight = 0;
    let visibleWidth = 0;
    let visiblePercentage = 0;

    let containerHeight = ((viewportHeight * .4) - 64);
    let containerWidth = viewportWidth - 32;

    if (rect.top < containerHeight && rect.bottom > 0) {
        // Element is at least partially visible
        visibleHeight = Math.min(rect.bottom, containerHeight) - Math.max(rect.top, 0);
        visibleWidth = Math.min(rect.right, containerWidth) - Math.max(rect.left, 0);

        const visiblePercentage = (visibleHeight * visibleWidth) / (rect.height * rect.width) * 100;
        console.log(`Visible percentage: ${visiblePercentage}%`);

        if (visiblePercentage >= 40) {
            console.log("Product is more than 40% visible, show product info.");
            //hoverProduct(dotnetReference, productId);
        }
    }
}