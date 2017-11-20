var extension = (function()
{
    var maxLength = 200;

    var ext = Object.create(null);
    var values = [];

    function extension()
    {
        this.len = function()
        {
            return values.length;
        };

        this.setMaxLength = function(len)
        {
            maxLength = len;
        };

        this.getMaxLength = function()
        {
            return maxLength;
        };

        this.insert = function(key, value)
        {
            if (this.len.apply() == this.getMaxLength.apply() &&
                typeof ext[key] == "undefined")
            {
                var id = values.shift();
                delete ext[id];
            }

            ext[key] = value;
            if (!this.contains(key))
            {
                values.push(key);
            }
        };

        this.value = function(key)
        {
            return ext[key];
        };

        this.contains = function(key)
        {
            return typeof ext[key] != "undefined";
        };

        this.remove = function(key)
        {
            if (this.contains(key))
            {
                delete ext[key];
            }
        };

        this.clear = function()
        {
            ext = Object.create(null);
            values = [];
        }
    }

    return extension;

})();
function enableExtension()
{
    broswer.browserAction.setIcon(
    {
        path :
        {
            32 : "icons/logo_32.png",
            48 : "icons/logo_48.png",
        }
    });
    broswer.tabs.onUpdated.addListener(sendMessage);
    broswer.webRequest.onBeforeRequest.addListener(
        processRequest,
        {urls: ["<all_urls>"]},
        ["blocking"]
    );
}

function disableExtension()
{
    broswer.browserAction.setIcon(
    {
        path :
        {
            32 : "icons/disabled_32.png",
            48 : "icons/disabled_48.png",
        }
    });
    broswer.tabs.onUpdated.removeListener(sendMessage);
    broswer.webRequest.onBeforeRequest.removeListener(processRequest);
    tabIds.clear();

}

