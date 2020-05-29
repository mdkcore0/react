import React, {Component} from 'react';
import {Alert} from 'react-native';
import {WebView} from 'react-native-webview';
import {accelerometer, setUpdateIntervalForType, SensorTypes}
    from "react-native-sensors";

export default class Test extends Component {
    constructor(props) {
        super(props);

        this.onWebViewMessage = this.onWebViewMessage.bind(this);
        this.state = {
            x: 0,
        };
    }

    componentDidMount() {
        // read sensor data each 1s
        setUpdateIntervalForType(SensorTypes.accelerometer, 1000);

        const subscription = accelerometer.subscribe(({x, y, z}) => {
            // keep track of x axis only
            this.setState(state => ({
                x: state.x
            }));

            // send all axis to the site
            data = {'x': x, 'y': y, 'z': z};
            this.sendWebViewMessage(data);
        });

        this.setState({subscription});
    }

    componentWillUnmount() {
        this.state.subscription.unsubscribe();
    }

    // send message to WebView
    sendWebViewMessage(data) {
        const message = `
            window.postMessage(${JSON.stringify(data)}, "*");
            true;
        `;

        this.webView.injectJavaScript(message);
    }

    // receiving a message from WebView
    onWebViewMessage(message) {
        console.log("MESSAGE FROM SITE:", message);
        Alert.alert("MESSAGE FROM SITE",
                    "Accumulated accelerometer value (x axis only): " +
                        message
        );
    }

    render() {
        // JS code to inject when page loads; will just update the background
        // color to white in 5s after loading, and is executed only once
        const changeBackgroundColor = `
            setTimeout(function() {
                document.body.style.background = 'white'
            }, 5000);
            true;
        `;
        // change to http://LOCAL_ADDRESS:3000
        // in the future use dotenv ou something similar and compatible with
        // 12 factor
        const uri = 'http://byne.com.br';

        return (
            <WebView
                source = {{uri: uri}}
                style = {{marginTop: 20}}

                // this only runs once
                injectedJavaScript = {changeBackgroundColor}

                ref = {webViewRef => (this.webView = webViewRef)}
                onMessage = {event => {
                    this.onWebViewMessage(event.nativeEvent.data);
                }}
            />
        );
    }
}
