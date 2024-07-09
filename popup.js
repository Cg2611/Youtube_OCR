// popup.js
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('captureButton').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'captureFrame' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Message error:', chrome.runtime.lastError);
        }
      });
    });
  });

  chrome.storage.local.get('detectedText', (data) => {
    document.getElementById('detectedText').value = data.detectedText || '';
  });

  document.getElementById('copyButton').addEventListener('click', () => {
    const detectedText = document.getElementById('detectedText');
    detectedText.select();
    document.execCommand('copy');
  });
});

// Listen for detected text from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.text) {
    document.getElementById('detectedText').value = message.text;
  }
});
