// content.js - Updated version
async function analyzePage(url) {
    try {
        // Get settings first
        const { threshold = 50, whitelist = [] } = await new Promise(resolve => {
            chrome.storage.local.get(['threshold', 'whitelist'], resolve);
        });

        // Parse URL and check whitelist
        const currentUrl = new URL(url);
        const currentHost = currentUrl.hostname.replace(/^www\./, ''); // Remove www prefix

        // Check if any whitelist domain matches (including subdomains)
        const isWhitelisted = whitelist.some(domain => {
            const cleanDomain = domain.replace(/^www\./, '').trim();
            return currentHost === cleanDomain ||
                currentHost.endsWith('.' + cleanDomain);
        });

        if (isWhitelisted) {
            console.log('Domain whitelisted:', currentHost);
            return;
        }

        // Proceed with analysis
        const response = await new Promise(resolve => {
            chrome.runtime.sendMessage({ type: 'analyze', url }, resolve);
        });

        if (response?.error) {
            console.error('Analysis error:', response.error);
            return;
        }

        const data = response?.result;
        if (!data) return;

        console.log('Analysis result:', data);

        if (data.riskScore >= threshold) {
            document.body.innerHTML = `
                <div style="color:white; background:#33363E; font-family:sans-serif; padding:20px;">
                  <h1>🚫 Access Blocked</h1>
                  <p>This page was blocked because it's considered a phishing risk (score: ${data.riskScore})</p>
                  <p>If you believe this is a mistake, you can add ${currentHost} to your whitelist in the extension popup.</p>
                </div>`;
            window.stop();
        }
    } catch (err) {
        console.error('Page analysis error:', err);
    }
}

// Run analysis with a small delay
setTimeout(() => {
    analyzePage(window.location.href);
}, 300);

// Link hover detection remains the same
document.addEventListener('mouseover', (e) => {
    const a = e.target.closest('a');
    if (a && a.href) {
        chrome.runtime.sendMessage({ type: 'analyze', url: a.href }, (res) => {
            if (res?.result?.riskScore > 50) {
                a.style.outline = '2px solid red';
                a.title = `⚠️ Phishing risk: ${res.result.riskScore}`;
            }
        });
    }
});