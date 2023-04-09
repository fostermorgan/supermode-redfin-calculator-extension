# How to compile
1. Install dependencies by running npm install
2. Build application by running npm run build

# How to run
1. go to chrome://extensions in google chrome browser
2. Enable Developer Mode by clicking the toggle switch next to Developer mode.
3. Click the Load unpacked button and select the extension directory (dist folder). 
    - Note: ID of the imported extension must be 'mecpnileeajpokfanihclfmklimnngkg' otherwise google auth will not work.
    - This ID is generated using the value for 'key' in manifest.json
    - if you change the key, you must create a new Chrome App OAuth 2.0 Client Id at https://console.cloud.google.com/ and update the manifest.json

# Stack

 - TypeScript
 - Webpack

## Guide

Bootstrapped from article on [Medium](https://enisfr.medium.com/creating-chrome-extensions-with-typescript-914873467b65#9f32-5ed6c8b8e388).
