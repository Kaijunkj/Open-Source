function updateCount(tabId, isOnRemoved) {
    browser.tabs.query({})
    .then((tabs) => {
      let lengths = tabs.length;
  
      if (isOnRemoved && tabId && tabs.map((t) => { return t.id; }).includes(tabId)) {
        lengths--;
      }
  
      browser.browserAction.setBadgeText({text: lengths.toString()});
      if (lengths < 3) {
          browser.browserAction.setBadgeBackgroundColor({'color': '#ff0000'});
      } else if (lengths > 6){
          browser.browserAction.setBadgeBackgroundColor({'color': '#00ff04'});
      } else {
          browser.browserAction.setBadgeBackgroundColor({'color': "#ff9400"});
      }
    });
  }
  
  
  browser.tabs.onRemoved.addListener(
    (tabId) => { updateCount(tabId, true);
  });
  browser.tabs.onCreated.addListener(
    (tabId) => { updateCount(tabId, false);
  });
  updateCount();
  