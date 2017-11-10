
function enableExtension() {
    chrome.browserAction.setIcon({
        path : {
            32 : "icons/logo_32.png",
            48 : "icons/logo_48.png",
        }
    });
    chrome.tabs.onUpdated.addListener(sendMessage);
    chrome.webRequest.onBeforeRequest.addListener(
        processRequest,
        {urls: ["<all_urls>"]},
        ["blocking"]
    );
}

function disableExtension() {
    chrome.browserAction.setIcon({
        path : {
            32 : "icons/logo_32.png",
            48 : "icons/logo_48.png",
        }
    });
    chrome.tabs.onUpdated.removeListener(sendMessage);
    chrome.webRequest.onBeforeRequest.removeListener(processRequest);
    tabIds.clear();

}

