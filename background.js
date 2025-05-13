// background.js - Add logging
const history = [];

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    console.log('Message received:', msg.type);

    if (msg.type === 'analyze') {
        console.log('Analyzing URL:', msg.url);
        fetch(`https://phishingdetector-production-a575.up.railway.app/analyze?url=${encodeURIComponent(msg.url)}`)
            .then(res => res.json())
            .then(data => {
                console.log('Analysis result:', data);

                // store history, max 10 items
                history.unshift({ domain: data.domain, riskScore: data.riskScore });
                if (history.length > 10) history.pop();

                // if risky, show a warning
                if (data.riskScore > 50) {
                    chrome.notifications.create({
                        type: 'basic',
                        iconUrl: 'icon-48.png',
                        title: 'Phishing Risk Detected',
                        message: `Warning: ${data.domain} has a high risk score of ${data.riskScore}`
                    });
                }

                sendResponse({ result: data });
            })
            .catch(err => {
                console.error('Fetch error:', err);
                sendResponse({ error: err.message });
            });

        return true; // Keep the message channel open for async response
    }

    if (msg.type === 'get-history') {
        console.log('Sending history:', history);
        sendResponse({ history });
    }
});