async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}

chrome.tabs.onActivated.addListener(async () => {
    const current = await getCurrentTab();
    console.log(current.title);
});