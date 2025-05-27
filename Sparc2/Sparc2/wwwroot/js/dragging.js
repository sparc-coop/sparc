//const draggableContent = document.getElementById('background');
//const draggableContent = document.getElementsByTagName('article')[0];
let isDragging = false;
let initialX, initialY;
const scrollSpeed = 1;

//console.log("start: " + window.scrollX, window.scrollY);

document.addEventListener('mousedown', (e) => {
    var draggableContent = document.getElementsByClassName('draggable');
    var draggableArray = Array.prototype.slice.call(draggableContent);

    if (draggableArray.includes(e.target) == false) return;

    isDragging = true;

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

    //console.log("initial: " + initialX, initialY);
    document.body.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const currentY = e.clientY;
    //console.log("current: " + currentX, currentY);

    var scrollToX = scrollSpeed * (initialX - currentX);
    var scrollToY = scrollSpeed * (initialY - currentY);
    //console.log("scroll to: " + scrollToX, scrollToY);

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