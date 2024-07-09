// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.text) {
    chrome.storage.local.set({ detectedText: request.text }, () => {
      console.log('Text saved');
    });

    // Send the detected text to the popup
    chrome.runtime.sendMessage({ text: request.text });
  }
});
