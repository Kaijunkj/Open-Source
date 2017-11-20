var notifications_id = '';

var background = (function () {
  var _tmp = {};
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    for (var id in _tmp) {
      if (_tmp[id] && (typeof _tmp[id] === "function")) {
        if (request.path == 'background-to-popup') {
          if (request.method === id) _tmp[id](request.data);
        }
      }
    }
  });
  
  return {
    "receive": function (id, callback) {_tmp[id] = callback},
    "send": function (id, data) {chrome.runtime.sendMessage({"path": 'popup-to-background', "method": id, "data": data})}
  }
})();

var updatestatus = function (e) {document.getElementById('status').textContent = e.target.title};
var resetstatus = function (e) {document.getElementById('status').textContent = "Tab Auto Refresh"};

var notifications = function (e) {
  var options = {
    "message": e,
    "type": "basic",
    "title": "Tab Auto Refresh",
    "iconUrl": chrome.runtime.getURL("data/icons/64.png")
  };
  
  if (notifications_id) {
    if (chrome.notifications.update) {
      return chrome.notifications.update(notifications_id, options, function () {});
    }
  }
  
  return chrome.notifications.create(options, function (e) {notifications_id = e});
};

var action = function (interval) {
  if (interval > -1) {
    document.getElementById('interval').value = interval;
    chrome.tabs.query({"active": true}, function (tabs) {
      var current = tabs && tabs.length ? tabs[0] : null;
      if (current) {
        
        var valid = current.url.indexOf("http") === 0 || current.url.indexOf("ftp") === 0;
        document.getElementById('tab').textContent = valid ? "Tab URL: " + current.url : "!!! Invalid Tab !!!";
        if (valid) background.send("store", {"tab": current, "options": {"interval": interval}});
        else notifications("Tab Auto Refresh is not working for " + current.url);
      }
    });
  }
};
var action = function (interval) {
  if (interval > -1) {
    document.getElementById('interval').value = interval;
    chrome.tabs.query({"active": true}, function (tabs) {
      var current = tabs && tabs.length ? tabs[0] : null;
      if (current) {
        var valid = current.url.indexOf("http") === 0 || current.url.indexOf("ftp") === 0;
        document.getElementById('tab').textContent = valid ? "Tab URL: " + current.url : "!!! Invalid Tab !!!";
        if (valid) background.send("store", {"tab": current, "options": {"interval": interval}});
        else notifications("Tab Auto Refresh is not working for " + current.url);
      }
    });
  }
};
