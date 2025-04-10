setTimeout(initScroll, 2000);

function initScroll() {
    window.addEventListener('scroll', () => {
        var home = document.getElementById("home");
        var heroText = document.getElementById("hero-text");
        var textWidth = heroText.offsetWidth;
        var mosaic = document.getElementById("mosaic-container");
        var mosaicWidth = mosaic.offsetWidth;
        var mosaicHeight = mosaic.offsetHeight;
        const scrolledTo = window.scrollY + window.innerHeight;
        const isReachBottom = document.body.scrollHeight === scrolledTo;

        if (home) {
            gsap.to("#hero-text", {
                //scrollTrigger: {
                //    scrub: 1,
                //},
                scale: 0,
                x: textWidth / 2,
                opacity: 0,
            });

            gsap.to("#mosaic-container", {
                //scrollTrigger: {
                //    scrub: 1,
                //},
                scale: 10,
                x: -(mosaicWidth/2),
                //y: mosaicHeight,
                opacity: 0,
                duration: 2,
                ease: "power1.in"
            });

            gsap.to("#scroll-text", {
                opacity: 0,
                y: 100,
            });

            document.getElementById("hero-text").classList.add("faded");

            if (document.body.scrollTop == (document.body.scrollHeight - document.body.offsetHeight)) {
                setTimeout(navigateToIdeas, 2000);
            }
        }
    });

    mouseClickHandler();
    pressEnter();
}

function navigateToIdeas() {
    window.location.href = "/ideas";
}

function mouseClickHandler() {
    addEventListener("click", function (e) {
        if (e.target.id === "scroll-text") {
            window.scrollTo(0, 10);
        }
    });
//    var scrollText = document.getElementById("scroll-text");

//    if (scrollText) {
//        scrollText.addEventListener("click", function (event) {
//            window.scrollTo(0, 10);
//        });
//    }
}

function pressEnter() {
    addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            window.scrollTo(0, 10);
        }
    });
}