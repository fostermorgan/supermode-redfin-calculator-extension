chrome.runtime.sendMessage({action: 'scrape'}, function(response) {
    if (response) {
      console.log(response);
    } else {
      console.error('Failed to scrape page');
    }
  });