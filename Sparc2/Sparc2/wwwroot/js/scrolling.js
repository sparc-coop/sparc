//gsap.registerPLugin(ScrollTrigger);
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
        //gsap.to("#home", {
        //    scrollTrigger: {
        //        scrub: 1
        //    },
        //    scale: 2,
        //    transformOrigin: "center center",
        //});

        gsap.to("#hero-text", {
            scrollTrigger: {
                scrub: 1,
            },
            scale: 0,
            x: textWidth / 2,
            opacity: 0,
        });

        gsap.to("#mosaic-container", {
            scrollTrigger: {
                scrub: 1,
            },
            scale: 7,
            x: -(mosaicWidth / 2),
            opacity: 0.75,
            y: mosaicHeight/2,
            //end: "+=100%",
        });

        if (isReachBottom) {
            window.location.href = "/ideas";
        }
    }
});