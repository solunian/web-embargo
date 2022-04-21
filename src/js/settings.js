const urlBox = document.querySelector("#urlBox-input");
const enterButton = document.querySelector("#urlInputEnter-button");
const blockedUrlUl = document.querySelector("#blockedUrls-ul");


// clears blockedUrlUl of items and updates it from storage
function updateBlockedUrlUl() {
    chrome.storage.sync.get("blocked_urls").then(val => {
        blockedUrlUl.innerHTML = null;
        if (Object.values(val).length == 0) {
            return;
        }
        for (const url of val["blocked_urls"]) {
            urlBox.value = null;
            urlListElement = document.createElement("li");
            urlListElement.innerText = url;
            blockedUrlUl.appendChild(urlListElement);
        }
    }); 
}

function addBlockedUrlToStorage(url) {
    chrome.storage.sync.get("blocked_urls").then(val => {
        let blocked_urls = [];
        if (Object.values(val).length > 0) {
            blocked_urls = val["blocked_urls"];
        }
        blocked_urls.push(url);
        chrome.storage.sync.set({"blocked_urls": blocked_urls});
    }).catch(e => {
        throw e;
    });
}

function addNewBlockedUrl(url) {
    addBlockedUrlToStorage(url);
    addBlockedUrlToDOM(url);
}

document.addEventListener("DOMContentLoaded", e => {
    // console.log("dom loaded!");
    updateBlockedUrlUl();
    
});

chrome.storage.onChanged.addListener(() => {
    // console.log("data changed!");
    updateBlockedUrlUl();
})


// DOM Listeners

urlBox.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addBlockedUrlToStorage(urlBox.value);
    }
});

enterButton.addEventListener("click", () => {
    addNewBlockedUrlToStorage(urlBox.value);
});