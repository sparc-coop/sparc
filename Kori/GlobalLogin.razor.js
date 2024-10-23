function screenSize() {
    var screenWidth = window.innerWidth;
    var menu = document.getElementsByClassName("kori-login__mobile-menu")[0];

    if (screenWidth <= 850) {
        menu.classList.add("show");
    } else {
        menu.classList.remove("show");
    }
}

window.addEventListener("reisze", e => {
    e.stopImmediatePropagation();
    screenSize();
});