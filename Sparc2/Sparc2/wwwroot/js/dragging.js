let isDragging = false;
let initialX, initialY;
const scrollSpeed = 1;

document.addEventListener('mousedown', (e) => {
    isDragging = true;
    initialX = e.clientX - window.scrollX;
    initialY = e.clientY - window.scrollY;
    document.body.style.cursor = 'grab';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const currentY = e.clientY;
    window.scrollTo(scrollSpeed * (initialX - currentX), scrollSpeed * (initialY - currentY));
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});

document.addEventListener('mouseleave', () => {
    isDragging = false;
    document.body.style.cursor = 'default';
});