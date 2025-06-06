# Phishing Detector – Firefox Extension

This is a lightweight Firefox browser extension that detects phishing attempts by analyzing the current website URL using a remote phishing detection backend.

---

## Installing and usage

The extension is already available on the Firefox Add-ons store. You can install it directly from there:

<https://addons.mozilla.org/en-US/firefox/addon/phishing-detector-extension/>

To use it, simply click the extension icon in the toolbar after visiting a website. The extension will analyze the URL and display the results in a popup.

If you wish to analyze many urls, there is also a web interface available at:

<https://phishing.fernandoa.dev/>

---

## Features

- Automatically checks every website you visit
- Sends the URL to a secure backend API for phishing analysis
- Displays:
  - Risk score (color-coded)
  - List of detected issues
  - Explanations of each potential threat
- Clean, dark-themed popup UI
- Uses your existing phishing detection backend (Express + TypeScript)

---

## How It Works

1. On any page load, `content.js` sends the current URL to `background.js`
2. `background.js` calls the backend API
3. The result is shown in the extension popup via `popup.html`

---

## Development & Testing

### Load the Extension in Firefox

1. Go to `about:debugging`
2. Click **“This Firefox”**
3. Click **“Load Temporary Add-on”**
4. Select the `manifest.json` file from this project

Now visit a site and click the extension icon to see phishing detection results.

---

## License

MIT

---

Made with by Fernando Alzueta using a custom phishing detection engine
