// selecting and unselecting kori-enabled elements
function toggleSelected(e) {
    if (e.target.closest('.kori-widget')) {
        console.log("clicked widget");
        if (e.target.closest('.options__edit')) {
            console.log("clicking edit content");
            toggleEdit(e.target);
            return;
        } else if (e.target.closest('.kori-edit__back') || e.target.closest('.kori-edit__cancel')) {
            console.log("closing edit");
            closeEdit();
        } else {
            return;
        }
    }


    console.log('unselecting');
    document.getElementsByClassName("selected")[0]?.classList.remove("selected");
    document.getElementsByClassName("show")[0]?.classList.remove("show");

    var t = e.target.closest('.kori-enabled');
    if (!t) {
        // clicked outside of all kori elements
        console.log('disable');
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        return;
    }

    if (!t.classList.contains('selected')) {
        console.log('selecting');
        t.classList.add("selected");
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        toggleWidget(t);
    }
}

window.addEventListener("click", e => {
    e.stopImmediatePropagation();
    toggleSelected(e);
});

// showing and hiding kori widget
function toggleWidget(t) {
    var widget = document.getElementById("kori-widget");
    var widgetActions = document.getElementById("kori-widget__actions");
    t.appendChild(widget);

    widget.classList.add('show');
    widgetActions.classList.add('show');
    widgetActions.style.right = "-444px";
}

// showing and hiding kori edit content menu
function toggleEdit(t) {
    console.log("opening edit content");
    var widgetActions = document.getElementById("kori-widget__actions");
    widgetActions.classList.remove('show');
    document.getElementById("kori-edit").classList.add('show');
    //document.getElementById("kori-widget").classList.add('show');
}

function closeEdit() {
    console.log("closing edit content");
    document.getElementById("kori-edit").classList.remove('show');
    document.getElementById("kori-widget__actions").classList.add('show');
}