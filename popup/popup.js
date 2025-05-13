// popup.js - Whitelist improvements
function renderWhitelist(list) {
    const ul = document.getElementById('whitelistList');
    ul.innerHTML = '';

    if (list.length === 0) {
        ul.innerHTML = '<li style="color:#a0a4ad;">No whitelisted domains</li>';
        return;
    }

    list.forEach(domain => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="whitelist-item">
                <span class="domain-text">${domain}</span>
                <button class="small-button remove-btn" data-domain="${domain}">Remove</button>
            </div>
        `;
        ul.appendChild(li);
    });

    // Add event listeners to all remove buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const domain = e.target.getAttribute('data-domain');
            removeFromWhitelist(domain);
        });
    });
}

function showWhitelistMessage(message, isError = true) {
    const msgElement = document.getElementById('whitelistError');
    msgElement.textContent = message;
    msgElement.className = isError ? 'error' : 'success';

    if (message) {
        setTimeout(() => {
            msgElement.textContent = '';
        }, 3000);
    }
}

function removeFromWhitelist(domain) {
    chrome.storage.local.get({ whitelist: [] }, data => {
        const updated = data.whitelist.filter(d => d !== domain);
        chrome.storage.local.set({ whitelist: updated });
        renderWhitelist(updated);
    });
}

// Initialize with current settings
chrome.storage.local.get(['threshold', 'whitelist'], data => {
    document.getElementById('threshold').value = data.threshold || 50;
    renderWhitelist(data.whitelist || []);
});

// Threshold change handler remains the same
document.getElementById('threshold').addEventListener('change', e => {
    const value = parseInt(e.target.value);
    chrome.storage.local.set({ threshold: value });
});

document.getElementById('addWhitelist').addEventListener('click', () => {
    const input = document.getElementById('whitelist');
    const domain = input.value.trim().toLowerCase();

    if (!domain) {
        showWhitelistMessage('Please enter a domain');
        return;
    }

    // Improved domain validation
    if (!/^([a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,}$/.test(domain)) {
        showWhitelistMessage('Please enter a valid domain (e.g., example.com)');
        return;
    }

    chrome.storage.local.get({ whitelist: [] }, data => {
        const normalizedDomain = domain.replace(/^www\./, '');
        const alreadyExists = data.whitelist.some(d =>
            d.replace(/^www\./, '').toLowerCase() === normalizedDomain
        );

        if (!alreadyExists) {
            const updated = [...data.whitelist, domain];
            chrome.storage.local.set({ whitelist: updated }, () => {
                renderWhitelist(updated);
                input.value = '';
                showWhitelistMessage('Domain added to whitelist', false);
            });
        } else {
            showWhitelistMessage('This domain is already whitelisted');
        }
    });
});


// Update the renderHistory function in popup.js
function renderHistory(history) {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';

    if (!history || history.length === 0) {
        historyList.innerHTML = '<li style="color:#a0a4ad;">No recent scans.</li>';
        return;
    }

    // Find the longest domain name to calculate spacing
    const maxLength = Math.max(...history.map(h => h.domain.length));

    history.forEach(h => {
        const li = document.createElement('li');
        li.style.fontFamily = "'Courier New', monospace"; // Monospace for alignment

        // Create fixed-width domain display
        const domainSpan = document.createElement('span');
        domainSpan.textContent = h.domain.padEnd(maxLength + 2, ' '); // Add padding
        domainSpan.style.color = '#00C9FF';
        domainSpan.style.display = 'inline-block';

        // Create score display
        const scoreSpan = document.createElement('span');
        scoreSpan.textContent = `: ${h.riskScore}`;
        scoreSpan.style.color = getColor(h.riskScore);

        li.appendChild(domainSpan);
        li.appendChild(scoreSpan);
        historyList.appendChild(li);
    });
}

// Then update your message handler to use this:
chrome.runtime.sendMessage({ type: 'get-history' }, (response) => {
    renderHistory(response.history || []);
});

function getColor(score) {
    if (score <= 30) return '#00ff88';
    if (score <= 70) return '#ffcc00';
    return '#ff4d4d';
}
