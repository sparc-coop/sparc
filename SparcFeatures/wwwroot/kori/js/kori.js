var koriAuthorized = false;

// mouse click handler for kori widget and elements
function mouseClickHandler(e) {
    var t = e.target;

    // click login menu
    if (t.closest(".kori-login__btn")) {
        koriAuthorized = true;
        if (koriAuthorized) {
            document.getElementById("kori-login").classList.remove("show");
        }
    }

    if (koriAuthorized) {
        // click kori widget
        if (t.closest(".kori-widget")) {
            if (t.closest('.options__edit')) {
                toggleEdit(true);
                return;
            } else if (t.closest('.kori-edit__back') || t.closest('.kori-edit__cancel')) {
                toggleEdit(false);
                resetWidgetPosition(); // Reset position here
            } else {
                return;
            }
        }

        // click kori enabled elements
        toggleSelected(t);
    } else {
        console.log("please login to use kori services");
        return;
    }
}

// mouse click event listener
window.addEventListener("click", e => {
    e.stopImmediatePropagation();
    mouseClickHandler(e);
});

// selecting and unselecting kori-enabled elements
function toggleSelected(t) {
    document.getElementsByClassName("selected")[0]?.classList.remove("selected");
    document.getElementsByClassName("show")[0]?.classList.remove("show");

    var koriElem = t.closest('.kori-enabled');
    if (!koriElem) {
        // clicked outside of all kori elements
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        return;
    }

    if (!koriElem.classList.contains("selected")) {
        koriElem.classList.add("selected");
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        toggleWidget(koriElem);
    }
}

// showing and hiding kori widget
function toggleWidget(t) {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");

    // Save initial position
    initialPosition = {
        top: widget.offsetTop,
        left: widget.offsetLeft
    };

    t.appendChild(widget);

    widget.classList.add("show");
    widgetActions.classList.add("show");
    widgetActions.style.right = "-444px";
}

// showing and hiding kori edit content menu
function toggleEdit(isOpen) {
    var edit = document.getElementById("kori-edit");
    var widgetActions = document.getElementById("kori-widget__actions");

    if (!edit.classList.contains("show") && isOpen == true) {
        widgetActions.classList.remove("show");
        edit.classList.add("show");
        widgetActions.classList.remove("show");
    }

    if (edit.classList.contains("show") && isOpen == false) {
        edit.classList.remove("show");
        widgetActions.classList.add("show");
    }
}

// login to use kori services
function login() {
    console.log("logging in...");

}


var startX, startY;
var widgetStartX, widgetStartY;

var widget = document.getElementById("kori-widget");

function startDrag(e) {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    widgetStartX = widget.offsetLeft;
    widgetStartY = widget.offsetTop;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
}

function drag(e) {
    var offsetX = e.clientX - startX;
    var offsetY = e.clientY - startY;
    var newX = widgetStartX + offsetX;
    var newY = widgetStartY + offsetY;

    
    newX = Math.max(newX, 0); 
    newY = Math.max(newY, 0);
    newX = Math.min(newX, window.innerWidth - widget.offsetWidth);
    newY = Math.min(newY, window.innerHeight - widget.offsetHeight); 

    widget.style.left = newX + 'px';
    widget.style.top = newY + 'px';
}

function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}


/*code relative to the commented div in KoriWidget.razor*/

//var initialPosition = { top: 0, left: 0 };
//var offset = { x: 0, y: 0 };

//function dragStart(event) {
//    var widget = document.getElementById("kori-widget");
//    offset.x = event.clientX - widget.getBoundingClientRect().left;
//    offset.y = event.clientY - widget.getBoundingClientRect().top;
//    widget.style.opacity = 0.5;
//    event.dataTransfer.setData("text/plain", null); // Necessary for Firefox
//}

//function dragging(event) {
//    var widget = document.getElementById("kori-widget");
//    var newX = event.clientX - offset.x;
//    var newY = event.clientY - offset.y;

//    var maxX = window.innerWidth - widget.offsetWidth;
//    var maxY = window.innerHeight - widget.offsetHeight;

//    newX = Math.max(0, Math.min(newX, maxX));
//    newY = Math.max(0, Math.min(newY, maxY));

//    widget.style.left = newX + 'px';
//    widget.style.top = newY + 'px';
//}

//function dragEnd(event) {
//    var widget = document.getElementById("kori-widget");
//    widget.style.opacity = 1;
//}

//window.addEventListener("dragover", function (e) {
//    e.preventDefault();
//});

//window.addEventListener("drop", function (e) {
//    e.preventDefault();
//    var widget = document.getElementById("kori-widget");
//    widget.style.left = (e.clientX - offset.x) + 'px';
//    widget.style.top = (e.clientY - offset.y) + 'px';
//});

//// Event listener for clicking and dragging the widget
//var isDragging = false;

//window.addEventListener("mousedown", function (event) {
//    var widget = document.getElementById("kori-widget");

//    if (event.target === widget) {
//        isDragging = true;
//        dragStart(event);
//    }
//});

//window.addEventListener("mousemove", function (event) {
//    if (isDragging) {
//        dragging(event);
//    }
//});

//window.addEventListener("mouseup", function (event) {
//    if (isDragging) {
//        isDragging = false;
//        dragEnd(event);
//    }
//});









