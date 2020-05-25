import React, { Component } from 'react';
import { WebView } from 'react-native-webview';

export default class Test extends Component {
    render() {
        return (
            <WebView
                source={{uri: 'http://byne.com.br'}}
                style={{marginTop: 20}}
            />
        );
    }
}
