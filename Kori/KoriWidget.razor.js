let translationCache = {};
let dotNet = {};
let app = {};
let observer = {};
let language = getBrowserLanguage();
var koriAuthorized = false;
var initialPosition = { left: 25 };
let widget = {};
let widgetActions = {};
let activeNode = null, activeMessageId = null;
var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;


let koriIgnoreFilter = function (node) {
    if (node.parentNode.nodeName == 'SCRIPT' || node.koriTranslated == language)
        return NodeFilter.FILTER_SKIP;

    var closest = node.parentElement.closest('.kori-ignore');
    if (closest)
        return NodeFilter.FILTER_SKIP;

    return NodeFilter.FILTER_ACCEPT;
}

function init(targetElementId, selectedLanguage, dotNetObjectReference, serverTranslationCache) {
    language = selectedLanguage;
    dotNet = dotNetObjectReference;

    if (serverTranslationCache) {
        translationCache = serverTranslationCache;
        for (let key in translationCache)
            translationCache[key].Nodes = [];
    }
    else {
        for (let key in translationCache) {
            translationCache[key].Submitted = false;
            translationCache[key].Translation = null;
            translationCache[key].Nodes = [];
        }
    }

    console.log('Kori translation cache initialized from Ibis, ', translationCache);

    if (/complete|interactive|loaded/.test(document.readyState)) {
        initElement(targetElementId);
    } else {
        window.addEventListener('DOMContentLoaded', () => initElement(targetElementId));
    }

    // mouse click event listener
    window.addEventListener("click", e => {
        e.stopImmediatePropagation();
        mouseClickHandler(e);
    });

    widget = document.getElementById("kori-widget");
    widgetActions = document.getElementById("kori-widget__actions");
    document.getElementById("dockButton").addEventListener("click", toggleDock);

    console.log('Kori widget initialized.');
}

function initElement(targetElementId) {
    console.log("Initializing element");
    app = document.getElementById(targetElementId);
    registerTextNodesUnder(app);
    translateNodes();

    observer = new MutationObserver(observeCallback);
    observer.observe(app, { childList: true, characterData: true, subtree: true });

    console.log('Observer registered for ' + targetElementId + '.');
}

function observeCallback(mutations) {
    console.log("Observe callback");
    mutations.forEach(function (mutation) {
        if (mutation.target.classList?.contains('kori-ignore') || mutation.target.parentElement?.classList.contains('kori-ignore'))
            return;

        if (mutation.type == 'characterData')
            registerTextNode(mutation.target);
        else
            mutation.addedNodes.forEach(registerTextNodesUnder);

        translateNodes();
    });
}

function registerTextNodesUnder(el) {
    var n, walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, koriIgnoreFilter);
    while (n = walk.nextNode())
        registerTextNode(n);

    // Figure out how to create a tree walker for image elements
    // Register the "src" attribute of the image element in exactly the same way as text content
    // Use the same translationCache, etc.
    var n, walk = document.createTreeWalker(el, NodeFilter.SHOW_ELEMENT, koriIgnoreFilter);
    while (n = walk.nextNode())
        if (n.nodeName == 'IMG')
            registerImageNode(n);
}

function registerTextNode(node) {
    if (node.koriRegistered == language || node.koriTranslated == language)
        return;

    var tag = node.koriContent ?? node.textContent.trim();
    if (!tag)
        return;

    node.koriRegistered = language;
    node.koriContent = tag;
    node.parentElement?.classList.add('kori-initializing');
    if (tag in translationCache && translationCache[tag].Nodes.indexOf(node) < 0) {
        translationCache[tag].Nodes.push(node);
    } else {
        translationCache[tag] = {
            Nodes: [node],
            Translation: null
        };
    }
}

function registerImageNode(node) {
    if (node.koriRegistered == language || node.koriTranslated == language)
        return;

    var tag = node.koriContent ?? node.src.trim();
    if (!tag)
        return;

    node.koriRegistered = language;
    node.koriContent = tag;
    node.parentElement?.classList.add('kori-initializing');
    if (tag in translationCache && translationCache[tag].Nodes.indexOf(node) < 0) {
        translationCache[tag].Nodes.push(node);
    } else {
        translationCache[tag] = {
            Nodes: [node],
            Translation: null
        };
    }
}

function translateNodes() {
    var contentToTranslate = [];
    for (let key in translationCache) {
        if (!translationCache[key].Submitted && !translationCache[key].Translation) {
            translationCache[key].Submitted = true;
            contentToTranslate.push(key);
        }
    }

    dotNet.invokeMethodAsync("TranslateAsync", contentToTranslate).then(translations => {
        console.log('Received new translations from Ibis.', translations);
        for (var i = 0; i < translations.length; i++) {
            if (translations[i] === "") {
                translations[i] = " ";
            }
            translationCache[contentToTranslate[i]].Translation = translations[i];
        }

        replaceWithTranslatedText();
    });
}

function replaceWithTranslatedText() {
    observer.disconnect();

    for (let key in translationCache) {
        var translation = translationCache[key];

        if (!translation.Translation)
            continue;

        for (let node of translation.Nodes) {
            // if the node is an img, replace the src attribute
            //if (node.nodeName == 'IMG') {
            //    node.src = translation.Translation;
            //    node.koriTranslated = language;
            //    continue;
            //}

            if (node.textContent != translation.Translation) {
                node.textContent = translation.Translation || "";
                node.koriTranslated = language;
            }

            node.parentElement?.classList.remove('kori-initializing');
            node.parentElement?.classList.add('kori-enabled');

            if (node.textContent.trim() == "") {
                node.parentElement?.classList.add('empty-content');
            }
        }
    }

    console.log('Translated page from Ibis and enabled Kori widget.');

    observer.observe(app, { childList: true, characterData: true, subtree: true });
}


function getBrowserLanguage() {
    var lang = (navigator.languages && navigator.languages.length) ? navigator.languages[0] :
        navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';
    return lang.substring(0, 2);
}

let playAudio = function (url) {
    const sound = new Howl({
        src: [url]
    });
    sound.play();
}

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
        //if (t.closest(".kori-widget")) {
        //    if (t.closest('.options__translation')) {
        //        toggleTranslation(true);
        //        return;
        //    } else if (t.closest('.kori-translation__back')) {
        //        toggleTranslation(false);
        //    } else if (t.closest('.options__search')) {
        //        toggleSearch(true);
        //        return;
        //    } else if (t.closest('.kori-search__back')) {
        //        toggleSearch(false);
        //    } else {
        //        return;
        //    }
        //}

        // click kori enabled elements
        toggleSelected(t);
    } else {
        console.log("please login to use kori services");
        return;
    }
}

// selecting and unselecting kori-enabled elements
function toggleSelected(t) {
    document.getElementsByClassName("selected")[0]?.classList.remove("selected");
    document.getElementsByClassName("show")[0]?.classList.remove("show");

    var koriElem = t.closest('.kori-enabled');
    if (!koriElem) {
        // clicked outside of all kori elements
        document.getElementsByClassName("show")[0]?.classList.remove("show");
        // reset right margin if widget is docked
        if (widget.classList.contains("docked")) {
            document.body.style.marginRight = '0';
        }
        resetWidgetPosition();
        activeNode = null;
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
    //var widgetActions = document.getElementById("kori-widget__actions");

    t.appendChild(widget);

    widget.classList.add("show");
    //widgetActions.classList.add("show");

    // search for matching node in translation cache
    for (let key in translationCache) {
        for (var i = 0; i < translationCache[key].Nodes.length; i++)
            if (t.contains(translationCache[key].Nodes[i])) {
                activeNode = translationCache[key].Nodes[i];
                activeMessageId = key;
                break;
            }
    }

    console.log('Set active node', activeNode);

    // after the widget is shown, make it draggable
    makeWidgetDraggable();
}

function edit() {
    if (!activeNode) {
        console.log('Unable to edit element', activeNode);
        return;
    }

    console.log('editing', activeNode.parentElement);

    activeNode.parentElement.classList.add('kori-ignore');
    activeNode.parentElement.contentEditable = "true";
    activeNode.parentElement.focus();
    document.getElementById("kori-widget").contentEditable = "false";

    //generateMarkdownEditor(activeNode.parentElement);
}

function editImage() {
    console.log("Entered the edit image function");
}

function getImageFile() {
    console.log("Getting image file");
    const fileInput = document.getElementById('imageInput');
    if (fileInput && fileInput.files.length > 0) {
        return fileInput.files[0].arrayBuffer().then(buffer => new Uint8Array(buffer));
    }
    return null;
};

function cancelEdit() {
    console.log("cancelling edit");
    activeNode.parentElement.contentEditable = "false";
    toggleWidget(activeNode.parentElement);
}

function save() {
    if (!activeNode)
        return;

    dotNet.invokeMethodAsync("SaveAsync", activeMessageId, activeNode.textContent).then(content => {
        console.log('Saved new content to Ibis.');
        // I don't think anything needs to change here for images,
        // because we are treating img src the same way as text content

        translationCache[activeMessageId].Translation = content.Text;

        activeNode.parentElement.contentEditable = "false";
        activeNode.parentElement.classList.remove('kori-ignore');

        // Here we just need to make sure that we are updating img src in the same way as 
        // we are updating text content
        replaceWithTranslatedText();
    });
}

// function to check if an element is a descendant of an element with a specific class
function isDescendantOfClass(element, className) {
    while (element) {
        if (element.classList && element.classList.contains(className)) {
            return true;
        }
        element = element.parentElement;
    }
    return false;
}

function checkSelectedContentType() {
    var selectedElement = document.getElementsByClassName("selected")[0];

    if (!selectedElement) {
        return "none";
    }

    if (selectedElement.tagName.toLowerCase() === 'img') {
        return "image";
    }

    // checks if the selected element has the classes 'kori-enabled' and 'selected'
    if (selectedElement.classList.contains('kori-enabled') && selectedElement.classList.contains('selected')) {
        var imgChildren = selectedElement.querySelectorAll('img');

        // Iterates over the child images to check for the presence of 'kori-ignore'
        for (var img of imgChildren) {
            // checks if the image is not inside a parent element with class 'kori-ignore'
            if (!isDescendantOfClass(img, 'kori-ignore')) {
                return "image";
            }
        }
    }

    // if it is not an image, assume it is text
    return "text";
}

// show and hide translation menu
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

// show and hide search/content navigation menu

function toggleSearch(isOpen) {
    console.log("opening search menu");
    var search = document.getElementById("kori-search");
    var widgetActions = document.getElementById("kori-widget__actions");

    if (!search.classList.contains("show") && isOpen == true) {
        widgetActions.classList.remove("show");
        search.classList.add("show");
        widgetActions.classList.remove("show");
    }

    if (search.classList.contains("show") && isOpen == false) {
        search.classList.remove("show");
        widgetActions.classList.add("show");
    }
}

// login to use kori services
function login() {
    console.log("logging in...");
}

// function to make the widget draggable
function makeWidgetDraggable() {
    // if widget is docked, do not make it draggable
    if (widget.classList.contains("docked")) {
        console.log("Widget is docked, cannot be dragged.");
        return;
    }

    // add mouse event to start dragging
    widgetActions.onmousedown = function (e) {
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

        // get parent element bounds
        var parentElem = widgetActions.parentElement;
        var parentRect = parentElem.getBoundingClientRect();

        // calculate new positions
        var newLeft = widgetActions.offsetLeft - pos1;
        var newTop = widgetActions.offsetTop - pos2;

        // get viewport dimensions
        var viewportWidth = window.innerWidth;
        var viewportHeight = window.innerHeight;

        // get widget dimensions
        var widgetWidth = widgetActions.offsetWidth;
        var widgetHeight = widgetActions.offsetHeight;

        const topBarHeight = 110;

        // calculate max and min positions
        var maxLeft = viewportWidth - (parentRect.left + widgetWidth);
        var maxTop = viewportHeight - (parentRect.top + (widgetHeight / 2));
        var minLeft = -parentRect.left;
        var minTop = -parentRect.top + topBarHeight;

        // constrain the widget within the viewport, considering parent element bounds
        newLeft = Math.max(minLeft, Math.min(maxLeft, newLeft));
        newTop = Math.max(minTop, Math.min(maxTop, newTop));

        // set the new widget position
        widgetActions.style.left = newLeft + "px";
        widgetActions.style.top = newTop + "px";
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

    widgetActions.style.left = initialPosition.left + 'px';
    widgetActions.style.top = '';
}

// dock and undock the widget
function toggleDock() {
    var dockButton = document.getElementById("dockButton");
    var dockIcon = dockButton.querySelector("img");

    if (!widget.classList.contains("docked")) {
        widget.classList.add("docked");
        widgetActions.style.left = '';
        widgetActions.style.right = '';
        widgetActions.style.top = '';
        dockButton.title = 'Undock';

        // Change the icon to undock
        dockIcon.src = '/_content/Kori/images/undock-icon.svg';

        // remove the ability to drag
        widgetActions.onmousedown = null;

        // adjusts the right margin to match the sidebar width
        document.body.style.marginRight = '298px';
    } else {
        widget.classList.remove("docked");
        dockButton.title = 'Dock';

        // Change the icon to dock
        dockIcon.src = '/_content/Kori/images/dock-icon.svg';

        resetWidgetPosition();

        widget.classList.add("animate-right-to-left");

        // add the ability to drag
        makeWidgetDraggable();

        // remove dynamic page size adjustment
        document.body.style.marginRight = '0';
    }
}

export { init, replaceWithTranslatedText, getBrowserLanguage, playAudio, edit, cancelEdit, save, checkSelectedContentType, editImage, getImageFile };