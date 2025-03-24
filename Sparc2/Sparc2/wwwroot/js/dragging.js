const draggableContent = document.getElementById('draggable-content');
let isDragging = false;
let initialX, initialY;
const scrollSpeed = 1;

console.log("start: " + window.scrollX, window.scrollY);

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    //initialX = e.clientX - window.scrollX;
    //initialY = e.clientY - window.scrollY;

    if (window.scrollX == 0) {
        initialX = e.clientX - window.scrollX;
    } else {
        initialX = e.clientX + window.scrollX;
    }

    if (window.scrollY == 0) {
        initialY = e.clientY - window.scrollY;
    } else {
        initialY = e.clientY + window.scrollY;
    }

    console.log("initial: " + initialX, initialY);
    document.body.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    console.log("current: " + currentX, currentY);

    var scrollToX = scrollSpeed * (initialX - currentX);
    var scrollToY = scrollSpeed * (initialY - currentY);
    console.log("scroll to: " + scrollToX, scrollToY);

    window.scrollTo(scrollToX, scrollToY);
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});

document.addEventListener('mouseleave', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});