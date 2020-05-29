import React from 'react';
import ReactDOM from 'react-dom';

var siteRef = React.createRef()
window.addEventListener("message", message => {
    console.log("MESSAGE FROM NATIVE: " + message.data);

    // NOTE: I prefer to use ref instead of global variables, see other
    // 'NOTE's in the code to test using 'window' instead of 'siteRef'.
    //window.site.setSensorData(message.data);
    let data = message.data;
    siteRef.current.setSensorValues(data);
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
            sensorXValue: 0,
            sensorYValue: 0,
            sensorZValue: 0,
            buttonEnabled: false,
        };

        this.counter = 0;
    }

    setSensorValues(data) {
        this.counter++;

        this.setState((state) => ({
            acc: state.acc + data['x'],
            sensorXValue: data['x'],
            sensorYValue: data['y'],
            sensorZValue: data['z'],
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
        let desc = "Send accumulated X axis sensor value";

        return (
            <div>
                <div>
                    <div>Current accelerometer values:</div>
                    <div>{this.counter}:</div>
                    <div style={{marginLeft: 15}}>x: {this.state.sensorXValue}</div>
                    <div style={{marginLeft: 15}}>y: {this.state.sensorYValue}</div>
                    <div style={{marginLeft: 15}}>z: {this.state.sensorZValue}</div>
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
