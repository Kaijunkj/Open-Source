var map = (function() {
    var _maxLength = 200;

    var _map = Object.create(null);
    var _keys = [];

    function map() {
        this.len = function() {
            return _keys.length;
        };

        this.setMaxLength = function(len) {
            _maxLength = len;
        };

        this.getMaxLength = function() {
            return _maxLength;
        };

        this.insert = function(key, value) {
            if (this.len.apply() == this.getMaxLength.apply() &&
                typeof _map[key] == "undefined") {
                var id = _keys.shift();
                delete _map[id];
            }

            _map[key] = value;
            if (!this.contains(key)) {
                _keys.push(key);
            }
        };

        this.value = function(key) {
            return _map[key];
        };

        this.contains = function(key) {
            return typeof _map[key] != "undefined";
        };

        this.remove = function(key) {
            if (this.contains(key)) {
                delete _map[key];
            }
        };

        this.clear = function() {
            _map = Object.create(null);
            _keys = [];
        }
    }

    return map;

})();
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
function removeURLParameters(url, parameters)
{
    parameters.forEach(function(parameter)
    {
        var urlparts = url.split('?');
        if (urlparts.length >= 2) {
            var prefix = encodeURIComponent(parameter) + '=';
            var pars = urlparts[1].split(/[&;]/g);

            for (var i = pars.length; i-- > 0;)
            {
                if (pars[i].lastIndexOf(prefix, 0) !== -1)
                {
                    pars.splice(i, 1);
                }
            }

            url = urlparts[0] + '?' + pars.join('&');
        }
    });
    return url;
}

var Tab_ID = new extension();

function sendMessage(TabID)
{
    if (Tab_ID.contains(TabID))
    {
        browser.tabs.sendMessage(TabID, {url: Tab_ID.value(TabID)});
    }
}

function processRequest(details)
{
    if (details.url.indexOf('mime=audio') !== -1)
    {
        var parametersToBeRemoved = ['range', 'rn', 'rbuf'];
        var audioURL = removeURLParameters(details.url, parametersToBeRemoved);
        if (Tab_ID.value(details.TabID) != audioURL) {
            Tab_ID.insert(details.TabID, audioURL);
            browser.tabs.sendMessage(details.TabID, {url: audioURL});
        }
    }
}
