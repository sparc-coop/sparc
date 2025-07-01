function morphMenuSvg(morphForward) {
    console.log('morphForward:', morphForward);
    if (morphForward) {
        const morph1 = KUTE.fromTo('#menu1A',
            { path: '#menu1A' },
            { path: '#menu3A' },
            { duration: 1500, easing: 'easingCubicOut', morphPrecision: 1 });
        const morph2 = KUTE.fromTo('#menu1B',
            { path: '#menu1B' },
            { path: '#menu3B' },
            { duration: 1500, easing: 'easingCubicOut', morphPrecision: 1 });
        const morph3 = KUTE.fromTo('#menu1C',
            { path: '#menu1C' },
            { path: '#menu3C' },
            { duration: 1500, easing: 'easingCubicOut', morphPrecision: 1 });

        !morph1.playing && morph1.start();
        !morph2.playing && morph2.start();
        !morph3.playing && morph3.start();
    } else {
        const morph1 = KUTE.fromTo('#menu1A',
            { path: '#menu1A' },
            { path: '#menu2A' },
            { duration: 1500, easing: 'easingCubicOut', morphPrecision: 1 });
        const morph2 = KUTE.fromTo('#menu1B',
            { path: '#menu1B' },
            { path: '#menu2B' },
            { duration: 1500, easing: 'easingCubicOut', morphPrecision: 1 });
        const morph3 = KUTE.fromTo('#menu1C',
            { path: '#menu1C' },
            { path: '#menu2C' },
            { duration: 250, easing: 'easingCubicOut', morphPrecision: 1 });
        !morph1.playing && morph1.start();
        !morph2.playing && morph2.start();
        !morph3.playing && morph3.start();
    }
}