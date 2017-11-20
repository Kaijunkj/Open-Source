var config = {};

config.welcome = {
  "timeout": 3000,
  get version () {return app.storage.read("version")},
  set version (val) {app.storage.write("version", val)},
};

config.tab = {
  "reset": function (tab) {app.storage.write('interval', {})},
  get interval () {return app.storage.read("interval") !== undefined ? app.storage.read("interval") : {}},
  set interval (o) {
    var tabinterval = config.tab.interval;
    tabinterval[o.tab.url] = o.options;
    app.storage.write('interval', tabinterval);
  },
  "clear": function (tab) {
    var tabinterval = config.tab.interval;
    delete tabinterval["undefined"];
    delete tabinterval[tab.url];
    app.storage.write('interval', tabinterval);
  },
  "options": function (tab) {
    var tabinterval = config.tab.interval;
    var tmp = tabinterval[tab.url];
    if (!tmp) {
      tmp = {};
      tmp.interval = 0;
    }
    return tmp;
  }
};