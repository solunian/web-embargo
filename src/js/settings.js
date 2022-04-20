const urlBox = document.querySelector("#urlBox-input");
const enterButton = document.querySelector("#urlInputEnter-button");
const blockedUrlUl = document.querySelector("#blockedUrls-ul");

// callbacks

// Where we will expose all the data we retrieve from storage.sync.
const storageCache = {};
// Asynchronously retrieve data from storage.sync, then cache it.
const initStorageCache = getAllStorageSyncData().then(items => {
    // Copy the data retrieved from storage into storageCache.
    Object.assign(storageCache, items);
});

chrome.action.onClicked.addListener(async (tab) => {
    try {
        await initStorageCache;
    } catch (e) {
        // Handle error that occurred during storage initialization.
    }
    // Normal action handler logic.
});

// Reads all data out of storage.sync and exposes it via a promise.
//
// Note: Once the Storage API gains promise support, this function
// can be greatly simplified.
function getAllStorageSyncData() {
    // Immediately return a promise and start asynchronous work
    return new Promise((resolve, reject) => {
        // Asynchronously fetch all data from storage.sync.
        chrome.storage.sync.get(null, (items) => {
            // Pass any observed errors down the promise chain.
            if (chrome.runtime.lastError) {
                return reject(chrome.runtime.lastError);
            }
            // Pass the data retrieved from storage down the promise chain.
            resolve(items);
        });
    });
}


function addBlockedUrl(url) {
    urlBox.value = null;
    urlListElement = document.createElement("li");
    urlListElement.innerText = url;
    blockedUrlUl.appendChild(urlListElement);

    chrome.storage.sync.get("blocked_urls").then(val => {
        if (typeof val == undefined) {
            const blocked_urls = [url];
            chrome.storage.sync.set({"blocked_urls": blocked_urls});
            console.log("storage is undefined");
        } else {
            const blocked_urls = storageCache["blocked_urls"] ?? [];
            blocked_urls.push(url);
            chrome.storage.sync.set({"blocked_urls": blocked_urls});
            console.log("storage is defined");
        }
    });
    

    chrome.storage.sync.get("blocked_urls").then(val => {
        console.log(val);
    });
}


// Event Listeners
urlBox.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        addBlockedUrl(urlBox.value);
    }
});

enterButton.addEventListener("click", () => {
    addBlockedUrl(urlBox.value);
});