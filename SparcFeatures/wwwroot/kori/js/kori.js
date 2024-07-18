var koriAuthorized = false;
var initialPosition = { top: 0, right: -25 };

// mouse click handler for kori widget and elements
function mouseClickHandler(e) {
    var t = e.target;

    // click login menu
    if (t.closest(".kori-login__btn")) {
        koriAuthorized = true;
        if (koriAuthorized) {
            document.getElementById("kori-login").classList.remove("show");
            document.body.classList.add("kori-loggedin"); // add the class to <body>
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
            } else if (t.closest('.options__translation')) {
                toggleTranslation(true);
                return;
            } else if (t.closest('.kori-translation__back')) {
                toggleTranslation(false);
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

    resetWidgetPosition();    

    t.appendChild(widget);     

    widget.classList.add("show");
    widgetActions.classList.add("show");    

    // add data attribute to widget with related element ID
    var relatedElementId = t.id || 'element-' + new Date().getTime();
    t.id = relatedElementId;
    widget.setAttribute('data-related-element', relatedElementId);

    // after the widget is shown, make it draggable
    makeWidgetDraggable();
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

// showing and hiding kori translation menu
function toggleTranslation(isOpen) {
    console.log("opening translation menu");
    var translation = document.getElementById("kori-translation");
    var widgetActions = document.getElementById("kori-widget__actions");

    if (!translation.classList.contains("show") && isOpen == true) {
        widgetActions.classList.remove("show");
        translation.classList.add("show");
        widgetActions.classList.remove("show");
    }

    if (translation.classList.contains("show") && isOpen == false) {
        translation.classList.remove("show");
        widgetActions.classList.add("show");
    }

}

// login to use kori services
function login() {
    console.log("logging in...");

}

// global variables for the widget and its positions
var widget = document.getElementById("kori-widget");
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

// function to make the widget draggable
function makeWidgetDraggable() {
    // add mouse event to start dragging
    widget.onmousedown = function (e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;

        // add 'no-transition' class when starting drag
        widget.classList.add("no-transition");
    };

    // function to drag the element
    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // calculates new positions
        var newLeft = widget.offsetLeft - pos1;
        var newTop = widget.offsetTop - pos2;

        // sets the new widget position
        widget.style.left = newLeft + "px";
        widget.style.top = newTop + "px";
    }

    // function to stop dragging
    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;

        // remove 'no-transition' class when stopping dragging
        widget.classList.remove("no-transition");
    }
}

// reset widget position to initial position
function resetWidgetPosition() {
    // do not reset position if widget is docked
    if (widget.classList.contains("docked")) {
        return;
    }

    widget.style.right = initialPosition.right + 'px';
    widget.style.top = initialPosition.top + 'px';
    widget.style.left = ''; // reset left to initial state (empty or null)
}

// dock and undock the widget
function toggleDock() {    
    var dockButton = document.getElementById("dockButton");

    if (!widget.classList.contains("docked")) {
        widget.classList.add("docked");
        widget.style.left = '';
        widget.style.right = '';
        widget.style.top = '';
        dockButton.title = 'Undock';

        // remove the ability to drag
        widget.onmousedown = null;

        // adjusts the right margin to match the sidebar width
        document.body.style.marginRight = '298px'; 
    } else {        
        widget.classList.remove("docked");
        dockButton.title = 'Dock';
        resetWidgetPosition();     

        widget.classList.add("animate-right-to-left");

        // add the ability to drag
        makeWidgetDraggable();

        // remove dynamic page size adjustment
        document.body.style.marginRight = '0';
    }
}

// dock/undock button click event
document.getElementById("dockButton").addEventListener("click", toggleDock);




