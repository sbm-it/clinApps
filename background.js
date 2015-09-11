// background code for webApp deployment
chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('index.html', {
    'outerBounds': {
      'width': 400,
      'height': 500
    },
    id: 'store'
  });
});