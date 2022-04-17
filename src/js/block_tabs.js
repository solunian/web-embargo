let tabs = chrome.tabs.query([]);
for (let i = 0; i < tabs.length; i++) {
    alert(tabs[i]);
}