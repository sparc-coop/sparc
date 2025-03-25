//gsap.registerPLugin(ScrollTrigger);

window.addEventListener('scroll', () => {
    var home = document.getElementsByClassName("home")[0];

    if (home) {
        gsap
        .timeline({
            scrollTrigger: {
                trigger: ".home",
                start: "top top",
                end: "+=100%",
                pin: true,
                scrub: true,
                //markers: true,
            },
        })
        .to(".mosaic-container img", {
            scale: 2,
            z: 250,
            transformOrigin: "center center",
        })
        //.to(".home", {
        //    scale: 1.4,
        //    boxShadow: '10000px 0 0 0 rgba(0,0,0,0.5) inset',
        //    transformOrigin: "center center",
        //},
        //    "<"
        //)
        .to(".mosaic-container", {
            autoAlpha: 0,
        })
        .to([".home, main"], {
            height: 400,
        });
    }
});