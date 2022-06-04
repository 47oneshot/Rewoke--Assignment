/**
 * @format
 */
import React from 'react';
import {AppRegistry, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import App from './src/App';
import {name as appName} from './app.json';

const ReduxAppWrapper = () => {
  return (
    <>
      <StatusBar backgroundColor={'#fff'} translucent barStyle="dark-content" />
      <App />
    </>
  );
};

AppRegistry.registerComponent(appName, () => ReduxAppWrapper);
