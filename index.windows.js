import React, { Component } from 'react';
import App from './src/App';
import { AppRegistry } from 'react-native';

export default class mobileApp extends Component {
  render() {
    return (
      <App />
    );
  }
}

AppRegistry.registerComponent('mobileAppWin', () => mobileApp);
