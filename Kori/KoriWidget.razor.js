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
    var approvedNodes = ['#text', 'IMG'];

    if (!approvedNodes.includes(node.nodeName) || node.parentNode.nodeName == 'SCRIPT' || node.koriTranslated == language)
        return NodeFilter.FILTER_SKIP;

    var closest = node.parentElement.closest('.kori-ignore');
    if (closest)
        return NodeFilter.FILTER_SKIP;

    return NodeFilter.FILTER_ACCEPT;
}

function init(targetElementId, selectedLanguage, dotNetObjectReference, serverTranslationCache) {
    language = selectedLanguage;
    dotNet = dotNetObjectReference;

    buildTranslationCache(serverTranslationCache);
    
    initKoriElement(targetElementId);

    window.addEventListener("click", e => {
        e.stopImmediatePropagation();
        mouseClickHandler(e);
    });

    initKoriWidget();
}

function initKoriWidget() {
    widget = document.getElementById("kori-widget");
    widgetActions = document.getElementById("kori-widget__actions");
    document.getElementById("dockButton").addEventListener("click", toggleDock);

    console.log('Kori widget initialized.');
}

function initKoriElement(targetElementId) {
    if (/complete|interactive|loaded/.test(document.readyState)) {
        initElement(targetElementId);
    } else {
        window.addEventListener('DOMContentLoaded', () => initElement(targetElementId));
    }
}

function buildTranslationCache(serverTranslationCache) {
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
}

function initElement(targetElementId) {
    console.log("Initializing element");

    app = document.getElementById(targetElementId);

    registerNodesUnder(app);
    //translateNodes();

    //TODO uncomment this
    //observer = new MutationObserver(observeCallback);
    //observer.observe(app, { childList: true, characterData: true, subtree: true });

    console.log('Observer registered for ' + targetElementId + '.');
}

function registerNodesUnder(el) {
    var n, walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, koriIgnoreFilter);
    while (n = walk.nextNode()){
        console.log('Registering node', n.nodeName);
         //registerNode(n);
    }
        
}

function registerNode(node) {
    if (node.koriRegistered == language || node.koriTranslated == language)
        return;

    var content = node.nodeName == 'IMG' ? node.src.trim() : node.textContent.trim();
    var tag = node.koriContent ?? content.trim();
    if (!tag)
        return;

    node.koriRegistered = language;
    node.koriContent = tag;
    node.parentElement?.classList.add('kori-initializing');

    if (tag in translationCache && translationCache[tag].Nodes.indexOf(node) < 0) {
        translationCache[tag].Nodes.push(node);
        
        //TODO check this logic
        if (translationCache[tag].id !== undefined && nodeType == NodeType.TEXT) {
            node.parentElement.setAttribute('kori-id', translationCache[tag].id);
        }

    } else {
        translationCache[tag] = {
            Nodes: [node],
            Translation: null
        };
    }
}

function observeCallback(mutations) {
    //console.log("Observe callback");
    mutations.forEach(function (mutation) {
        if (mutation.target.classList?.contains('kori-ignore') || mutation.target.parentElement?.classList.contains('kori-ignore'))
            return;

        if (mutation.type == 'characterData')
            registerNode(mutation.target, NodeType.TEXT);
        else
            mutation.addedNodes.forEach(registerTextNodesUnder);

        translateNodes();
    });
}

function translateNodes() {
    console.log('translateNodes');
    var contentToTranslate = [];
    for (let key in translationCache) {
        if (!translationCache[key].Submitted && !translationCache[key].Translation) {
            translationCache[key].Submitted = true;
            contentToTranslate.push(key);
        }
    }

    dotNet.invokeMethodAsync("TranslateAsync", contentToTranslate).then(translations => {
        //console.log('Received new translations from Ibis.', translations);
        for (var i = 0; i < translations.length; i++) {
            console.log(translations[i]);
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
            if (node.nodeName == 'IMG') {
                node.src = translation.Translation;
                node.koriTranslated = language;
            } else if (node.textContent != translation.Translation) {
                node.textContent = translation.text || "";
                //node.textContent = translation.Translation || "";
                node.koriTranslated = language;
            }

            node.parentElement?.classList.remove('kori-initializing');
            node.parentElement?.classList.add('kori-enabled');

            if (node.textContent.trim() == "") {
                node.parentElement?.classList.add('empty-content');
            }

            if (translation.text && node.parentElement) {
                node.parentElement.innerHTML = removePTag(translation.html);
            }
        }
    }

    console.log('Translated page from Ibis and enabled Kori widget.');

    observer.observe(app, { childList: true, characterData: true, subtree: true });
}

function removePTag(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const pTag = doc.querySelector('p');
    if (pTag) {
        return pTag.innerHTML;
    } else {
        return html;
    }
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
    console.log('toggleWidget', t);

    var widget = document.getElementById("kori-widget");
    //var widgetActions = document.getElementById("kori-widget__actions");
    console.log('wdiget', widget);
    t.appendChild(widget);

    widget.classList.add("show");
    //widgetActions.classList.add("show");

    console.log('toggleWidget', t);
    console.log('parent id', t.getAttribute('kori-id'));
    const koriId = t.getAttribute('kori-id');
    // search for matching node in translation cache
    for (let key in translationCache) {
        for (var i = 0; i < translationCache[key].Nodes.length; i++)

            if (t.contains(translationCache[key].Nodes[i])) {
                activeNode = translationCache[key].Nodes[i];
                activeMessageId = key;
                break;
            }

            if (koriId != null && koriId == translationCache[key].id) {
                activeNode = t;
                activeMessageId = key;
                break;
            }
            
            
    }

    console.log('Set active node', activeNode);

    // after the widget is shown, make it draggable
    makeWidgetDraggable();
}

function getActiveImageSrc() {
    if (activeNode && activeNode.tagName === 'IMG') {
        return activeNode.src;
        console.log('Active node is an image', activeNode.src);
    }

    console.log('Active node is not an image', activeNode)
    return null; 
}

function edit() {
    if (!activeNode) {
        console.log('Unable to edit element', activeNode);
        return;
    }

    var translation = translationCache[activeMessageId];

    if (isTranslationAlreadySaved(translation)) {
        var activeNodeParent = getActiveNodeParentByKoriId(translation);
        activateNodeEdition(activeNodeParent);
        replaceInnerHtmlBeforeWidget(activeNodeParent, getTranslationRawMarkdownText(translation));
    }
    else {
        activateNodeEdition(activeNode.parentElement);
        activeNode.textContent = getTranslationRawMarkdownText(translation);
    }
    
    document.getElementById("kori-widget").contentEditable = "false";
}

function getTranslationRawMarkdownText(translation) {
    return translation.text ?? translation.Translation;
}

function activateNodeEdition(node) {
    node.classList.add('kori-ignore');
    node.contentEditable = "true";
    node.focus();
}

function deactivateNodeEdition(node) {
    node.contentEditable = "false";
    node.classList.remove('kori-ignore');
    node.classList.remove('selected');
    node.innerHTML = removePTag(translation.html);
}

function getActiveNodeParentByKoriId(translation) {
    return document.querySelector(`[kori-id="${translation.id}"]`);
}

function isTranslationAlreadySaved(translation) {
    return translation.id;
}

function replaceInnerHtmlBeforeWidget(node, markdownTxt) {
    while (node.firstChild) {
        if (node.firstChild.id !== "kori-widget") {
            node.removeChild(node.firstChild);
        } else {
            break;
        }
    }

    node.firstChild.insertAdjacentHTML('beforebegin', markdownTxt);
}

function editImage() {
    console.log("Entered the edit image function");
}

function cancelEdit() {
    console.log("cancelling edit");

    console.log('active node', activeNode);

    activeNode.parentElement.contentEditable = "false";
    activeNode.parentElement.classList.remove('selected');
    widget.classList.remove("show");

    var translation = translationCache[activeMessageId];

    if (isTranslationAlreadySaved(translation)) {
        var activeNodeParent = document.querySelector(`[kori-id="${translation.id}"]`);
        deactivateNodeEdition(activeNodeParent);
    }else {
        activeNode.textContent = translation.Translation; //TODO check this
    }
}

function save() {
    if (!activeNode)
        return;

    var translation = translationCache[activeMessageId];
    console.log("translation: ", translation);
    var textContent = activeNode.textContent;
    
    if (translation.id) {
        var activeNodeParent = document.querySelector(`[kori-id="${translation.id}"]`);

        var copyNode = activeNodeParent.cloneNode(true);
        console.log('copy node', copyNode.children);
        var koriWidget = copyNode.querySelector('#kori-widget');
        //moveWidgetToRootElement();
        //copyNode.removeChild(copyNode.lastChild);
        textContent = copyNode.textContent.replace(koriWidget.textContent, '');
        
        console.log('node', activeNodeParent);
        console.log('active node parent', copyNode);
    }

    dotNet.invokeMethodAsync("SaveAsync", activeMessageId, textContent).then(content => {
        console.log('Saved new content to Ibis.', content);
        console.log('parent element', activeNode.parentElement);
        // I don't think anything needs to change here for images,
        // because we are treating img src the same way as text content

        
        translationCache[activeMessageId].Translation = content.text;

        activeNode.parentElement.contentEditable = "false";
        activeNode.parentElement.classList.remove('kori-ignore');

        if (translation.id) {
            var activeNodeParent = document.querySelector(`[kori-id="${translation.id}"]`);
            console.log('active node parent', activeNodeParent);
            //TODO deactivate function
            activeNodeParent.contentEditable = "false";
            activeNodeParent.classList.remove('kori-ignore');
            activeNodeParent.classList.remove('selected');
            //moveWidgetToRootElement();
            //activeNodeParent.innerHTML = removePTag(content.html)
            replaceInnerHtml(activeNodeParent, removePTag(content.html));


        } else {
            translationCache[activeMessageId].id = content.id;
            activeNode.parentElement?.setAttribute('kori-id', content.id);
            //moveWidgetToRootElement();
            //activeNode.parentElement.innerHTML = removePTag(content.html);
            replaceInnerHtml(activeNode.parentElement, removePTag(content.html));
        }

        
        dotNet.invokeMethodAsync("BackToEdit").then(r => console.log('backToEdit'));
        // Here we just need to make sure that we are updating img src in the same way as 
        // we are updating text content
        //replaceWithTranslatedText();
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
    //console.log("opening search menu");
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

function resetWidgetPosition() {
    // do not reset position if widget is docked
    if (widget.classList.contains("docked")) {
        return;
    }

    widgetActions.style.left = initialPosition.left + 'px';
    widgetActions.style.top = '';
}


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


function applyMarkdown(symbol) {
    const selectedText = window.getSelection().toString();
    if (selectedText) {
        const newText = symbol + selectedText + symbol;
        document.execCommand('insertText', false, newText);
    }
}

function moveWidgetToRootElement() {
    var widget = document.getElementById("kori-widget");
    if (widget) {
        document.documentElement.appendChild(widget);
        widget.classList.remove('show');
    }
    
}


export { init, replaceWithTranslatedText, getBrowserLanguage, playAudio, edit, cancelEdit, save, checkSelectedContentType, editImage, getActiveImageSrc };
