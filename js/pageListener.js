function sendMessage(details, website) {
    console.log(website)
    let tabId = details.tabId;
    chrome.tabs.sendMessage(tabId, { type: 'process page', website: website });
}

function addListener(website, urlfilters, callback) {
    chrome.webNavigation.onHistoryStateUpdated.addListener(
        callback? callback : (details) => {sendMessage(details, website)},
        {url: urlfilters}
    );
    chrome.webNavigation.onDOMContentLoaded.addListener(
        callback? callback : (details) => {sendMessage(details, website)},
        {url: urlfilters}
    );
}

addListener("dblp/pid", [{hostContains: "dblp.", pathPrefix: "/pid"}, {hostContains: "dblp2.", pathPrefix: "/pid"}])
addListener("dblp/search", [{ hostContains: "dblp.", pathPrefix: "/search" }, { hostContains: "dblp2.", pathPrefix: "/search" }])


addListener("dblp/db_index", [{ hostContains: "dblp.", pathPrefix: "/db", pathSuffix: "/index.html" }, { hostContains: "dblp2.", pathPrefix: "/db", pathSuffix: "/index.html" }],
    (details) => {
        if (details.url.endsWith("index.html"))
            sendMessage(details, "dblp/db_index")
        else
            sendMessage(details, "dblp/db_no_index")
    })

addListener("google scholar/scholar", [{hostContains: "scholar.google.", pathPrefix: "/scholar"}])
addListener("google scholar/citations", [{hostContains: "scholar.google.", pathPrefix: "/citations"}])
addListener("connected papers", [{hostContains: ".connectedpapers.", pathPrefix: "/main"}])
addListener("semantic scholar/paper", [{hostContains: ".semanticscholar.", pathPrefix: "/paper"}])
addListener("semantic scholar/search", [{hostContains: ".semanticscholar.", pathPrefix: "/search"}])
