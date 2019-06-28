# Oniro
## Cloning instructions
1. create a new blank ionic project `ionic start tmp blank`
2. remove the src folder from the newly created project
3. clone this repo
4. copy all the files from the blank project to the repo folder
5. add <br>`<preference name="GOOGLE_MAPS_ANDROID_API_KEY" value="YOUR_API_KEY"/>`<br>
     	`<preference name="GOOGLE_MAPS_IOS_API_KEY" value="YOUR_API_KEY"/>`<br>
	to your config.xml file
6. start working :weary:

## Platforms/Plugins
After cloning the project, add the following plugins and platforms:<br>
`ionic cordova platform add android`<br>
`ionic cordova platform add ios`<br>
`ionic cordova plugin add cordova-plugin-bluetooth-serial`<br>
`npm install @ionic-native/bluetooth-serial`<br>
`ionic cordova plugin add cordova-sqlite-storage`<br>
`npm install --save @ionic/storage`<br>
`ionic cordova plugin add cordova-plugin-network-information`<br>
`npm install @ionic-native/network`<br>
`ionic cordova plugin add cordova-plugin-googlemaps`<br>
`npm install --save @ionic-native/core@latest`<br>
`npm install --save @ionic-native/google-maps@latest`<br>
`ionic cordova plugin add call-number` <br>
`npm install @ionic-native/call-number` <br>
`ionic cordova plugin add cordova-plugin-camera` <br>
`npm install --save @ionic-native/camera` <br>
`ionic cordova plugin add cordova-plugin-background-mode ` <br>
`npm install @ionic-native/background-mode ` <br>
`npm install angular-google-charts` <br>
`ionic cordova plugin add cordova-plugin-file` <br>
`npm install @ionic-native/file` <br>
`ionic cordova plugin add cordova-plugin-file-transfer` <br>
`npm install @ionic-native/file-transfer` <br>
`npm install hammerjs`<br>
`ionic cordova plugin add cordova.plugins.diagnostic` <br>
`npm install @ionic-native/diagnostic` <br>
## Bug da fixare


