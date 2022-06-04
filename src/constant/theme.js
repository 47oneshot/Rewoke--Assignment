import {Dimensions} from 'react-native';

const screen_width = percentage =>
  (Dimensions.get('window').width * percentage) / 100;
const screen_height = percentage =>
  (Dimensions.get('window').height * percentage) / 100;

export const uid = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const colors = {
  primary: '#75c145',
  secondary: '#a3d084',
  danger: 'red',
  colorbg: '#4fae52',
  buttonbg: '#398d3d',
  white: '#ffffff',
  black: '#000000',
  grey: '#f6f6f6',
  deepGrey:'#a4a4a4'
};

const size = {
  appSpacing: 15,
  verticalSpacing: 50,
  textFontSize: 25,
  smallTextFontSize: 20,
  tooSmallTextFontSize: 15,
};

export {colors, size, screen_width, screen_height};
