var core = {
    "refresh": [],
    "remove": function (tabId) {core.stop({"id": tabId}, false)},
    "update": function (tab) {core.valid(tab.url) ? core.load(tab) : core.stop(tab, true)},
    "valid": function (url) {return url.indexOf("http") === 0 || url.indexOf("ftp") === 0 ? true : false},
    "clear": function (e) {for (var i = 0; i < core.refresh.length; i++) if (core.refresh[i] === e) return core.refresh.splice(i, 1)},
    "init": function (tabs) {for (var i = 0; i < tabs.length; i++) core.valid(tabs[i].url) ? core.load(tabs[i]) : core.stop(tabs[i], true)},
    "retrieve": function (tab) {
      for (var i = 0; i < core.refresh.length; i++) if (core.refresh[i].tab.id === tab.id) return core.refresh[i];
      return null;
    },
    "on": function (tab, interval) {
      var tmp = core.retrieve(tab);
      return tmp && tmp.value === interval ? true : false;
    },
    "load": function (tab) {
      var tmp = config.tab.options(tab);
      var valid = tmp && tmp.interval > 0;
      var path = valid ? "ON" : "OFF";
      var title = valid ? "Tab Auto Refresh: ON" + " (refresh every " + tmp.interval + " seconds)" : "Tab Auto Refresh: OFF";
      valid ? core.start({"tab": tab}) : core.stop(tab, true);
      app.icon(tab.id, path, title);
    },
    "loop": function (tab) {
      var tmp = config.tab.options(tab);
      app.tab.update(tab.id, {"url": tab.url});
      config.tab.interval = {"tab": tab, "options": tmp};
      if (LOG) console.error(">", "tab", tab.url, "interval", tmp.interval);
    },
    "reset": function () {
      for (var i = 0; i < core.refresh.length; i++) window.clearInterval(core.refresh[i].id);
      core.refresh = [];
      config.tab.reset();
    },
    "stop": function (tab, flag) {
      var tmp = core.retrieve(tab);
      if (tmp) {
        core.clear(tmp);
        window.clearInterval(tmp.id);
      }
      if (tab.url) config.tab.clear(tab);
      if (flag) app.icon(tab.id, "OFF", "Tab Auto Refresh: OFF");
    },
    "start": function (e) {
      if (core.valid(e.tab.url)) {
        var tmp = config.tab.options(e.tab);
        if (tmp && tmp.interval > 0) {
          var interval = tmp.interval * 1000;
          app.icon(e.tab.id, "ON", "Tab Auto Refresh: ON");
          if (!core.on(e.tab, interval)) {
            core.stop(e.tab, false);
            id = window.setInterval(function () {core.loop(e.tab)}, interval);
            core.refresh.push({"id": id, "tab": e.tab, "value": interval});
            config.tab.interval = {"tab": e.tab, "options": tmp};
          }
        } else core.stop(e.tab, true);
      } else core.stop(e.tab, true);
    }
  };
  
  app.popup.receive("reset", core.reset);
  app.popup.receive("storage", function (e) {app.popup.send("storage", config.tab.options(e))});
  
  app.popup.receive("store", function (o) {
    config.tab.interval = o;
    core.start(o);
  });
  
  window.setTimeout(function () {
    app.tab.query(core.init);
    app.tab.onRemoved(core.remove);
    app.tab.onUpdated(core.update);
    app.tab.onActivated(core.update);
  }, 300);