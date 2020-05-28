import React from 'react';
import ReactDOM from 'react-dom';

var siteRef = React.createRef()
window.addEventListener("message", message => {
    console.log("MESSAGE FROM NATIVE: " + message.data);

    // NOTE: I prefer to use ref instead of global variables, see other
    // 'NOTE's in the code to test using 'window' instead of 'siteRef'.
    //window.site.setSensorData(message.data);
    siteRef.current.setSensorValue(message.data);
});

window.webViewBridge = {
    send: function(message) {
        console.log("SEND TO NATIVE:", message);

        if (window.ReactNativeWebView)
            window.ReactNativeWebView.postMessage(message);
        else
            console.log("Not running inside React Native");
    },
};

class Site extends React.Component {
    constructor(props) {
        super(props);

        // NOTE: uncomment this line to use 'window'
        //window.site = this;
        this.state = {
            acc: 0,
            sensorValue: 0,
            buttonEnabled: false,
        };

        this.counter = 0;
    }

    setSensorValue(value) {
        this.counter++;
        this.setState((state) => ({
            acc: state.acc + value,
            sensorValue: value,
        }));

        if (this.counter >= 30) {
            this.counter = 0;

            this.setState((state) => ({
                buttonEnabled: !state.buttonEnabled
            }));
            alert("THIS IS A MESSAGE FROM THE SITE: The button is now " +
                (this.state.buttonEnabled ? "enabled" : "disabled")
            );
        }
    }

    render() {
        let desc = "Send accumulated sensor value";

        return (
            <div>
                <div>
                    <div>Current accelerometer value (x axis only):</div>
                    <div>{this.counter}: {this.state.sensorValue}</div>
                    <button
                        style={{
                            marginTop: 20,
                            width: 200,
                            height: 100
                        }}
                        onClick = {() => window.webViewBridge.send(
                            this.state.acc
                        )}
                        disabled = {!this.state.buttonEnabled}
                    >
                    {desc}
                    </button>
                </div>
          </div>
        );
    }
}

document.body.style = 'background: darkgray'
ReactDOM.render(
    // NOTE: uncomment this line to use 'window' and comment the line with 'ref'
    //<Site />,
    <Site ref={siteRef}/>,
    document.getElementById('root')
);
