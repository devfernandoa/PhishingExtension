chrome.runtime.sendMessage({
  type: 'analyze',
  url: window.location.href
});
