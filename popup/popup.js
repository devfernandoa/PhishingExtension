chrome.runtime.sendMessage({ type: 'get-history' }, (response) => {
    const root = document.getElementById('root');
    const history = response.history || [];

    if (history.length === 0) {
        root.innerHTML = `<p>No recent scans.</p>`;
        return;
    }

    root.innerHTML = `
    <h1>Recent URL Scans</h1>
    <ul>
      ${history.map(h => `
        <li>
          <span style="color:#00C9FF;">${h.domain}</span>: 
          <span style="color:${getColor(h.riskScore)};">${h.riskScore}</span>
        </li>`).join('')}
    </ul>
  `;
});

function getColor(score) {
    if (score <= 30) return '#00ff88';
    if (score <= 70) return '#ffcc00';
    return '#ff4d4d';
}
