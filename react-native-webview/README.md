# React Native WebView + Sensors test

This is an example on how to load a page using [React Native WebView](https://github.com/react-native-community/react-native-webview), read data from accelerometer using [React Native Sensors](https://react-native-sensors.github.io/)
and sending data between the native app (Android) and the web page.

## web
See [web README.md](./web/README.md) file.

## native
See [native README.md](./native/README.md) file.

Change the **uri** variable on *App.js* to your local address (in the future
will use environment variables to control this):
```
const uri = 'http://192.168.0.1:3000';
```

If starting a new project, you can install **RNWebView** and **RNSensors**
running the following:
```
$ npm install --save react-native-webview
$ npm install --save react-native-sensors
$ npx react-native link react-native-sensors
```
