// content.js
import Tesseract from './tesseract.min.js';

// Function to capture a video frame and perform OCR
function captureAndProcessFrame() {
  const video = document.querySelector('video');
  if (!video) {
    console.error('No video element found');
    return;
  }

  // Create a canvas to draw the video frame
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw the current video frame on the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const frameData = canvas.toDataURL('image/png');

  // Use Tesseract.js to perform OCR on the captured frame
  Tesseract.recognize(
    frameData,
    'eng',
    {
      logger: m => console.log(m)
    }
  ).then(({ data: { text } }) => {
    console.log('Detected text:', text);
    if (text.trim()) {
      // Send detected text to the background script
      chrome.runtime.sendMessage({ text });
    }
  }).catch(err => {
    console.error('Tesseract error:', err);
  });
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'captureFrame') {
    captureAndProcessFrame();
  }
});
