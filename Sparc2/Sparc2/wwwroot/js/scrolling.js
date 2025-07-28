setTimeout(initScroll, 2000);

window.setEditingUsername = function (value) {
    window.isEditingUsername = value;
}

function initScroll() {
    window.addEventListener('scroll', () => {
        var home = document.getElementById("home");

        if (home) {
            var heroText = document.getElementById("hero-text");
            var textWidth = heroText.offsetWidth;
            var mosaic = document.getElementById("mosaic-container");
            var mosaicWidth = mosaic.offsetWidth;
            var mosaicHeight = mosaic.offsetHeight;
            const scrolledTo = window.scrollY + window.innerHeight;
            const isReachBottom = document.body.scrollHeight === scrolledTo;
            gsap.to("#hero-text", {
                //scrollTrigger: {
                //    scrub: 1,
                //},
                scale: 0.2,
                x: -textWidth,
                opacity: 0,
                duration: 1.5,
            });

            gsap.to("#mosaic-container", {
                //scrollTrigger: {
                //    scrub: 1,
                //},
                scale: 10,
                x: (mosaicWidth + 400) / -2,
                y: (mosaicHeight - 400) / 2,
                opacity: 0,
                duration: 2,
                ease: "power1.in",
            });

            gsap.to("#scroll-text", {
                opacity: 0,
                y: 100,
            });

            gsap.to("#nav", {
                opacity: 0,
                y: -100,
            });

            document.getElementById("hero-text").classList.add("faded");

            if (document.body.scrollTop == (document.body.scrollHeight - document.body.offsetHeight)) {
                setTimeout(navigateToCatalog, 2000);
            }
        }
    });

    mouseClickHandler();
    pressEnter();
}

function navigateToCatalog() {
    window.location.href = "/store";
}

function mouseClickHandler() {
    addEventListener("click", function (e) {    
        if (window.isEditingUsername) return;
        if (e.target.closest("#scroll-text") || e.target.closest("#ideas-btn") || e.target.closest("#enter-btn") || e.target.closest("#mosaic")) {
            window.scrollTo(0, 10);
        }
    });
}

function pressEnter() {
    addEventListener("keydown", function (e) {
        if (window.isEditingUsername) return;
        if (e.key === "Enter") {
            window.scrollTo(0, 10);
        }
    });
}

// loading ideas explore page at center of content

function findBackground() {
    console.log("finding background");
    return document.getElementById("background");
}

function findCenter() {
    var background = document.getElementById("background");
    var width = background.offsetWidth;
    var height = background.offsetHeight;
    var centerX;
    var centerY;

    if (background) {
        if (width > 0 && height > 0) {       
            width = background.offsetWidth;
            height = background.offsetHeight;
            centerX = width / 8;
            centerY = height / 4;

            scrollToCenter(centerX, centerY);
        } else {
            console.log("background is zero");
            background = findBackground();
            width = background.offsetWidth;
            height = background.offsetHeight;
            centerX = width / 8;
            centerY = height / 4;

            console.log("Width: " + width);
            console.log("Height: " + height);
            scrollToCenter(centerX, centerY);
        }
    } 
}

function scrollToCenter(x, y) {
    window.scrollTo(x, y);
    console.log("scrolling to center of content at: " + x + ", " + y);
}

function disableBodyScrolling(bool) {
    if (bool == true) {
        document.body.classList.add("modal-open");
    } else {
        document.body.classList.remove("modal-open");
    }
}
function scrollToElement(id) {
    if (id) {
        var elem = document.getElementById(id);
        elem.classList.add("highlight");
        elem.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
        });
    }
}