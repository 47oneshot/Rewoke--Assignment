'use strict';
import React, {PureComponent} from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firestore from '@react-native-firebase/firestore';
import DeviceInfo from 'react-native-device-info';

const RNFS = require('react-native-fs');

import {colors, screen_height, screen_width, size} from '../constant/theme';
import {RNCamera} from 'react-native-camera';

class RecorderScreen extends PureComponent {
  constructor() {
    super();
    this.handleRecord = this.handleRecord.bind(this);
    this.uuid = this.uuid.bind(this);
    this.state = {
      isRecording: false,
    };
  }

  currDeviceId = DeviceInfo.getUniqueId();

  uuid = () => {
    return 'app_video_' + Math.random().toString(36).substr(2, 5);
  };

  handleRecord = async () => {
    if (this.state.isRecording) {
      this.camera.stopRecording();
      this.setState({isRecording: false});
    } else {
      if (this.camera) {
        this.setState({isRecording: true});
        const {uri, codec = 'mp4'} = await this.camera.recordAsync();
        if (uri) {
          const fileName = `${this.uuid()}.mp4`;
          const destination = RNFS.DownloadDirectoryPath + '/' + 'InVideoApp';
          console.log('uuid---', fileName);

          RNFS.exists(destination)
            .then(async res => {
              if (!res) {
                await RNFS.mkdir(destination);
              }
            })
            .then(async () => {
              await RNFS.moveFile(uri, destination + '/' + fileName);
              console.log('save successfully');
              ToastAndroid.show('Video save successfully!', ToastAndroid.SHORT);
            })
            .then(async () => {
              await firestore()
                .collection('play_list')
                .add({
                  deviceId: this.currDeviceId,
                  file: destination + '/' + fileName,
                })
                .catch(error => console.log(error))
                .then(() =>
                  ToastAndroid.show(
                    'Video details save successfully!',
                    ToastAndroid.SHORT,
                  ),
                );
            });
        }
      }
    }
  };
  render() {
    return (
      <SafeAreaView style={styles.root}>
        <StatusBar
          backgroundColor={'transparent'}
          translucent
          barStyle="light-content"
          animated
        />
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          type={RNCamera.Constants.Type.back}
          captureAudio
          flashMode={RNCamera.Constants.FlashMode.on}
          defaultVideoQuality={'1080p'}
          autoFocus
        />

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={this.handleRecord}>
          {this.state.isRecording ? (
            <Icon name="stop" size={screen_width(8)} color={colors.white} />
          ) : (
            <Icon
              name="record-circle-outline"
              size={screen_width(8)}
              color={colors.white}
            />
          )}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

export default RecorderScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingVertical: screen_height(5),
  },
  inputContainer: {
    paddingHorizontal: size.appSpacing,
  },
  heading: {
    fontSize: size.textFontSize,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary,
    paddingVertical: size.appSpacing,
  },
  textInputLabel: {
    marginVertical: size.appSpacing / 2,
    backgroundColor: colors.white,
  },
  button: {
    position: 'absolute',
    bottom: screen_width(15),
    alignSelf: 'center',
    height: screen_width(15),
    width: screen_width(15),
    borderRadius: screen_width(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  },
  textButton: {
    fontSize: size.smallTextFontSize,
    fontWeight: 'bold',
    color: colors.white,
  },
  error: {color: colors.danger, fontSize: size.tooSmallTextFontSize},
  camera: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  fab: {
    position: 'absolute',
    margin: size.appSpacing,
    alignSelf: 'center',
    bottom: 0,
    backgroundColor: colors.primary,
  },
});
