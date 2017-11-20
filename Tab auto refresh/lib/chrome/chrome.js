var app = {};

app.loadReason = "startup";
app.version = function () {return chrome.runtime.getManifest().version};
if (chrome.runtime.onInstalled) chrome.runtime.onInstalled.addListener(function (e) {app.loadReason = e.reason});
if (chrome.runtime.setUninstallURL) chrome.runtime.setUninstallURL(config.welcome.url + "?v=" + app.version() + "&type=uninstall", function () {});

app.storage = (function () {
  var objs = {};
  window.setTimeout(function () {
    chrome.storage.local.get(null, function (o) {
      objs = o;
      var script = document.createElement("script");
      script.src = "../common.js";
      document.body.appendChild(script);
    });
  }, 300);
 
  return {
    "read": function (id) {return objs[id]},
    "write": function (id, data) {
      var tmp = {};
      objs[id] = data;
      tmp[id] = data;
      chrome.storage.local.set(tmp, function () {});
    }
  }
})();

app.icon = function (id, path, title) {
  chrome.browserAction.setTitle({"tabId": id, "title": title});
  chrome.browserAction.setIcon({
    "tabId": id,
    "path": {
      "16": "../../data/icons/" + path + "/16.png",
      "32": "../../data/icons/" + path + "/32.png",
      "48": "../../data/icons/" + path + "/48.png",
      "64": "../../data/icons/" + path + "/64.png"
    }
  });
};

app.tab = {
  "update": function (id, e) {chrome.tabs.update(id, e, function () {})},
  "open": function (url) {chrome.tabs.create({"url": url, "active": true})},
  "openOptions": function () {chrome.runtime.openOptionsPage(function () {})},
  "query": function (callback) {chrome.tabs.query({}, function (tabs) {callback(tabs)})},
  "onRemoved": function (callback) {chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {callback(tabId)})},
  "onUpdated": function (callback) {chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {callback(tab)})},
  "onActivated": function (callback) {
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) if (tabs[i].id === activeInfo.tabId) callback(tabs[i]);
      });
    });
  }
};

app.popup = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path === 'popup-to-background') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data, tabId) {
      chrome.runtime.sendMessage({"path": 'background-to-popup', "method": id, "data": data});
    }
  }
})();
