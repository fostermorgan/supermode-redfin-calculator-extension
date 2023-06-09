// Listen for the "scrape" message from the popup
chrome.runtime.onMessage.addListener((message: { action: string }, sender, sendResponse) => {
    if (message.action === 'scrape') {
      // Get the current active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // Execute a content script in the current active tab
        if(tabs[0].id != undefined){
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    func: () => {
                        let toReturn = {address: "", price: "", monthlyTaxes: 0, yearlyTaxes: 0, monthlyTaxesDisplay: ""}

                        const addressElement = document.querySelector('.address');
                        if (addressElement) {
                            // Return the text content of the price element
                            let text = addressElement.textContent?.trim();
                            if(text != null){
                                toReturn.address = text;
                            }else {
                                toReturn.address = "Address information found."
                            }
                        }

                        const taxElement = document.querySelector('.CalculatorSummary');
                        if (taxElement) {
                            // Return the text content of the price element
                            let text = taxElement.textContent?.trim(); 
                            if(text != null){
                                let monthlyWithCommas = text.substring(text.indexOf('Property Taxes') + 15, text.indexOf('Homeowners'))
                                toReturn.monthlyTaxesDisplay = text.substring(text.indexOf('Property Taxes') + 14, text.indexOf('Homeowners')) + "/mo";
                                let monthly = monthlyWithCommas.replace(/\,/g, '')
                                toReturn.monthlyTaxes = parseInt(monthly);
                                toReturn.yearlyTaxes = parseInt(monthly) * 12;
                            }else {
                                toReturn.monthlyTaxesDisplay = "Tax information not found."
                            }
                        }

                        const priceElement = document.querySelector('.home-main-stats-variant');
                        if (priceElement) {
                            // Return the text content of the price element
                            let text = priceElement.textContent?.trim();
                            if(text != null){
                                let totalPrice = text.substring(0, text.indexOf('Est'))
                                toReturn.price = totalPrice;
                            }else {
                                toReturn.price = "Price information not found."
                            }
                        }
                        return toReturn;
                    },
                },
                (result) => {
                    if (chrome.runtime.lastError) {
                        console.error('Error executing content script:', chrome.runtime.lastError.message);
                        sendResponse("Error parsing data. Make sure your on a detailed view of a house on redfin.");
                    } else {
                        sendResponse({ response: result[0] });
                    }
                }
            );
        }
      });
      // Indicate that the response will be sent asynchronously
      return true;
    }
  });