import {
  checkMultiple,
  PERMISSIONS,
  RESULTS,
  request,
  requestMultiple,
  openSettings,
} from 'react-native-permissions';
import {Platform} from 'react-native';

export const usePermission = () => {
  const permission = {
    camera: {
      android: PERMISSIONS.ANDROID.CAMERA,
      ios: PERMISSIONS.IOS.CAMERA,
    },
    audio: {
      android: PERMISSIONS.ANDROID.RECORD_AUDIO,
      ios: PERMISSIONS.IOS.MICROPHONE,
    },
    read_storage: {
      android: PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.MEDIA_LIBRARY,
    },
    write_storage: {
      android: PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      ios: PERMISSIONS.IOS.PHOTO_LIBRARY,
    },
  };

  const multiplePermission = [
    permission.camera[Platform.OS],
    permission.audio[Platform.OS],
    permission.read_storage[Platform.OS],
    permission.write_storage[Platform.OS],
  ];

  const requestPermission = type => {
    request(type).then(result => {
      console.log(result);
    });
  };

  const requestMultiplePermission = () => {
    requestMultiple(multiplePermission).then(result => {
      console.log(result);
    });
  };

  const appPermission = () => {
    requestMultiplePermission();
  };

  return {appPermission};
};
