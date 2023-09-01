parsers = {}

chrome.runtime.onMessage.addListener((message, messageSender, sendResponse) => {
    if (message.type !== 'process page')
        return false
    let parser = parsers[message.website]
    if(parser !== undefined)
        parser()
});


