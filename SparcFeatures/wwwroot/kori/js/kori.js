var koriAuthorized = false;
var initialPosition = { top: 0, left: 0 };

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
    //widgetActions.style.right = "-444px";

    // add data attribute to widget with related element ID
    var relatedElementId = t.id || 'element-' + new Date().getTime();
    t.id = relatedElementId; 
    widget.setAttribute('data-related-element', relatedElementId);
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

    // Add the no-transition class to remove transitions
    widget.classList.add('no-transition');

    // reset right to 0 when starting to drag
    //var widgetActions = document.getElementById("kori-widget__actions");
    //widgetActions.style.right = 'auto';

    // add data attribute to widget with related element ID
    var relatedElementId = widget.getAttribute('data-related-element');
    if (!relatedElementId) {
        var relatedElement = document.querySelector('.selected');
        if (relatedElement) {
            relatedElementId = relatedElement.id || 'element-' + new Date().getTime();
            relatedElement.id = relatedElementId; 
            widget.setAttribute('data-related-element', relatedElementId);
        }
    }
}

function drag(e) {
    var offsetX = e.clientX - startX;
    var offsetY = e.clientY - startY;
    var newX = widgetStartX + offsetX;
    var newY = widgetStartY + offsetY;

    widget.style.left = newX + 'px';
    widget.style.top = newY + 'px';
}

function stopDrag() {
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);

    // remove the no-transition class to restore transitions
    widget.classList.remove('no-transition');

    // maintain related element ID
    var relatedElementId = widget.getAttribute('data-related-element');
    if (relatedElementId) {
        var relatedElement = document.getElementById(relatedElementId);
        if (relatedElement) {
            relatedElement.appendChild(widget);
        }
    }
}

// reset widget position to initial position
function resetWidgetPosition() {
    var widgetActions = document.getElementById("kori-widget__actions");
    
    widget.style.left = initialPosition.left + 'px';
    widget.style.top = initialPosition.top + 'px';
    //widgetActions.style.right = '-444px';
}

// get the widget's initial position
function getInitialPosition() {
    var widget = document.getElementById("kori-widget");
    return {
        top: widget.offsetTop,
        left: widget.offsetLeft
    };
}

// add event listener to start dragging
widget.addEventListener('mousedown', startDrag);


