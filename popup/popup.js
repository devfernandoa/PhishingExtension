chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    chrome.runtime.sendMessage({ type: 'analyze', url: tab.url }, (response) => {
        const root = document.getElementById('root');
        if (response.error) {
            root.innerHTML = `<p class="error">Error: ${response.error}</p>`;
            return;
        }

        const { domain, riskScore, issues } = response.result;
        const color = riskScore <= 30 ? '#00ff88' : riskScore <= 70 ? '#ffcc00' : '#ff4d4d';

        root.innerHTML = `
        <h1>${domain}</h1>
        <p style="color:${color}; font-weight:bold;">Risk Score: ${riskScore}</p>
        <ul>${issues.map(i => `<li><b>${i.type}</b>: ${i.message}</li>`).join('')}</ul>
      `;
    });
});
