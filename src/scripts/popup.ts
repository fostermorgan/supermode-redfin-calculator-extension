let data: any[] = [];
let scrapeCount: number = 0;

let analyzeButton: HTMLElement | null = document.getElementById("analyze-button");
let signInButton: HTMLElement | null = document.getElementById("google-signin-btn");
let signOutButton: HTMLElement | null = document.getElementById("google-signout-btn");
let parseContent: HTMLElement | null = document.getElementById("parse-content");
let actionButtons: HTMLElement | null = document.getElementById("action-buttons");
let signInButtonContainer: HTMLElement | null = document.getElementById("sign-in-button-container");
let signOutButtonContainer: HTMLElement | null = document.getElementById("sign-out-button-container");
let scrapeContainer: HTMLElement | null = document.getElementById("scrape-container");
let scrapeCountDiv: HTMLElement | null = document.getElementById("scrape-count");
let errorMessageDiv: HTMLElement | null = document.getElementById("error-message");
let downloadCSVButton: HTMLElement | null = document.getElementById("download-csv");

analyzeButton?.addEventListener("click", scrapeData);
signInButton?.addEventListener('click', signIn);
signOutButton?.addEventListener('click', signOut);
downloadCSVButton?.addEventListener("click", downloadCsv);

function signIn() {
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + token);
    xhr.onload = function() {
      var response = JSON.parse(xhr.responseText);
      var email = response.email;
      let currentUser = document.getElementById("current-user");
      if(currentUser != null){
        currentUser.innerHTML = "Welcome, " + email + "!";
      } 

      //toggle elements to display
      if(signOutButtonContainer != null)
        signOutButtonContainer.style.display = "block";

      if(actionButtons != null)
        actionButtons.style.display = "block";
        
      if(signInButtonContainer != null)
        signInButtonContainer.style.display = "none";

      if(scrapeContainer != null)
        scrapeContainer.style.display = "block";
    };
    xhr.send();
  });
}

function signOut() {
  chrome.identity.clearAllCachedAuthTokens(() => {
    let currentUser = document.getElementById("current-user");
      if(currentUser != null){
        currentUser.innerHTML = "";
      } 

      //toggle elements to display
      if(signOutButtonContainer != null)
        signOutButtonContainer.style.display = "none";

      if(actionButtons != null)
        actionButtons.style.display = "none";

      if(parseContent != null)
        parseContent.style.display = "none";
      
      if(signInButtonContainer != null)
        signInButtonContainer.style.display = "block";
      
      if(downloadCSVButton != null){
        downloadCSVButton.style.display = "none";
      } 
      
      if(scrapeContainer != null){
        scrapeContainer.style.display = "none";
        scrapeCount = 0;
        if(scrapeCountDiv != null){
          scrapeCountDiv.innerHTML = scrapeCount.toString();
        }
      }
      
  })
}

function scrapeData(){
  chrome.runtime.sendMessage({action: 'scrape'}, function(response) {
    console.log('response: ')
    console.log(response)
    if (response && response.response) {
      clearError()
      data = []; //reset data variable to avoid duplicate/incorrect values
      //display parsed content
      if(parseContent != null)
        parseContent.style.display = "block";

      data.push(response.response.result);
      let addressDoc = document.getElementById("address");
      if(addressDoc != null){
        if(response.response.result.address.toString() == ""){
          displayError()
          addressDoc.innerHTML = "Address not found." 
        } else  {
          addressDoc.innerHTML = response.response.result.address.toString();
        }
      }

      let priceDoc = document.getElementById("price");
      if(priceDoc != null){
        if(response.response.result.price.toString() == ""){
          displayError()
          priceDoc.innerHTML = "Price not found." 
        } else  {
          priceDoc.innerHTML = response.response.result.price.toString();
        }
      } 
      let taxesDoc = document.getElementById("taxes");
      if(taxesDoc != null){
        if(response.response.result.monthlyTaxesDisplay.toString() == ""){
          displayError()
          taxesDoc.innerHTML = "Taxes not found." 
        } else  {
          taxesDoc.innerHTML = response.response.result.monthlyTaxesDisplay.toString();
        }
      } 
      

      //update scrape counter
      scrapeCount++;
      if(scrapeCountDiv != null){
        scrapeCountDiv.innerHTML = scrapeCount.toString();
      }

      //after clicking analyze, show the download button 
      if(downloadCSVButton != null){
        downloadCSVButton.style.display = "block";
      } 
      
    } else {
      console.error('error')
      console.error(response.response.result)
    }
  })
}

function displayError(){
  if(errorMessageDiv != null){
    errorMessageDiv.innerHTML = "There was an error when analyzing the current page. Make sure the current page is the detail view on redfin.com. <a href=\"https://www.redfin.com/WI/Altoona/2304-Hayden-Ave-54720/home/89850465\">example</a>";
  } 
}

function clearError () {
  if(errorMessageDiv != null){
    errorMessageDiv.innerHTML = "";
  } 
}

function downloadCsv() {
  const filename = 'data.csv';
  const csvData = convertToCsv(data);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function convertToCsv(data: any) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = headers.map(header => {
      const escapedValue = ('' + row[header]).replace(/"/g, '\\"');
      return `"${escapedValue}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}