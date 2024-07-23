let translationCache = {};
let dotNet = {};
let app = {};
let observer = {};
let language = getBrowserLanguage();

let koriIgnoreFilter = function (node) {
    if (node.parentNode.nodeName == 'SCRIPT' || node.koriTranslated == language)
        return NodeFilter.FILTER_SKIP;

    if (!node.textContent.trim())
        return NodeFilter.FILTER_SKIP;

    var closest = node.parentElement.closest('.kori-ignore');
    if (closest)
        return NodeFilter.FILTER_SKIP;

    return NodeFilter.FILTER_ACCEPT;
}

function init(targetElementId, selectedLanguage, dotNetObjectReference, serverTranslationCache) {
    language = selectedLanguage;
    dotNet = dotNetObjectReference;
    
    if (serverTranslationCache)
        translationCache = serverTranslationCache;
    else {
        for (let key in translationCache) {
            translationCache[key].submitted = false;
            translationCache[key].translation = null;
        }
    }

    if (/complete|interactive|loaded/.test(document.readyState)) {
        initElement(targetElementId);
    } else {
        window.addEventListener('DOMContentLoaded', () => initElement(targetElementId));
    }
}

function initElement(targetElementId) {
    app = document.getElementById(targetElementId);
    registerTextNodesUnder(app);
    translateNodes();

    observer = new MutationObserver(observeCallback);
    observer.observe(app, { childList: true, characterData: true, subtree: true });
}

function observeCallback(mutations) {
    mutations.forEach(function (mutation) {
        if (mutation.target.classList?.contains('kori-ignore') || mutation.parentElement?.closest('kori-ignore'))
            return;

        if (mutation.type == 'characterData') {
            registerTextNode(mutation.target);
        }
        else
            mutation.addedNodes.forEach(registerTextNodesUnder);
    });

    translateNodes();
}

function registerTextNodesUnder(el) {
    var n, walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, koriIgnoreFilter);
    while (n = walk.nextNode())
        registerTextNode(n);
}

function registerTextNode(node) {
    if (node.koriRegistered == language || node.koriTranslated == language)
        return;

    var nodeText = node.koriContent ?? node.textContent.trim();
    if (!nodeText)
        return;

    node.koriRegistered = language;
    node.koriContent = nodeText;
    node.parentElement?.classList.add('kori-initializing');
    if (nodeText in translationCache && translationCache[nodeText].Nodes.indexOf(node) < 0) {
        translationCache[nodeText].Nodes.push(node);
    } else {
        translationCache[nodeText] = {
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
        for (var i = 0; i < translations.length; i++) {
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
            if (node.textContent != translation.Translation) {
                node.textContent = translation.Translation;
                node.koriTranslated = language;
            }
            node.parentElement?.classList.remove('kori-initializing');
            node.parentElement?.classList.add('kori-enabled');
        }
    }

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

export { init, replaceWithTranslatedText, getBrowserLanguage, playAudio };