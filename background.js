chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'analyze') {
        fetch(`https://phishingdetector-production-a575.up.railway.app/analyze?url=${encodeURIComponent(msg.url)}`)
            .then(res => res.json())
            .then(data => sendResponse({ result: data }))
            .catch(err => sendResponse({ error: err.message }));
        return true; // keeps the message channel open
    }
});
