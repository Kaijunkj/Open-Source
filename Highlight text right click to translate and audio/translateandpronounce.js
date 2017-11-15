storage.get({
    'pageLang': 'en',
    'userLang': 'es',
    'ttsLang': 'en'
}, function (items) {
    var pageLang = items.pageLang,
        userLang = items.userLang,
        ttsLang = items.ttsLang;

    chrome.contextMenus.create({
        id: 'translate',
        title: chrome.i18n.getMessage('contextMenuTitleTranslate', [pageLang, userLang]),
        contexts: ['selection']
    });
});