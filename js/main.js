parsers = {}

chrome.runtime.onMessage.addListener((message, messageSender, sendResponse) => {
    if (message.type !== 'process page')
        return false
    console.log("reveive message")
    let parser = parsers[message.website]
    if(parser !== undefined)
        parser()
});


