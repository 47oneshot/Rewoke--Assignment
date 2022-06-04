import 'react-native-gesture-handler';
import * as React from 'react';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import firestore from '@react-native-firebase/firestore';

import {RecorderScreen, VideoListScreen} from './pages';
import {colors, screen_height, size} from './constant/theme';
import {usePermission} from './utills/permission';

const Stack = createStackNavigator();

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
      }}>
      <LottieView source={require('./assets/loading.json')} autoPlay loop />
    </View>
  );
};

function AppScreenStack() {
  return (
    <Stack.Navigator initialRouteName={'VideoList'}>
      <Stack.Screen
        name="Recorder"
        component={RecorderScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.primary,
            height: screen_height(15),
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: size.textFontSize,
            color: colors.black,
          },
          headerTitleAlign: 'center',
          title: 'Video Details',
        }}
        name="VideoList"
        component={VideoListScreen}
      />
    </Stack.Navigator>
  );
}

function App() {
  const [screenRender, setScreenRender] = React.useState(false);
  const {appPermission} = usePermission();

  const handleDeviceId = async () => {
    let deviceList = [];
    const currDeviceId = DeviceInfo.getUniqueId();

    await firestore()
      .collection('user_device')
      .get()
      .then(querySnapshot => {
        querySnapshot?.forEach(queryDocumentSnapshot => {
          deviceList.push(queryDocumentSnapshot.get('deviceId'));
        });
        console.log(deviceList);
      })
      .then(async () => {
        const isDeviceExists = deviceList.indexOf(currDeviceId);

        if (isDeviceExists == -1) {
          await firestore()
            .collection('user_device')
            .add({
              deviceId: currDeviceId,
            })
            .catch(error => console.log(error))
            .then(() => console.log('added successfully'));
        }
      })
      .then(() => {
        setTimeout(() => setScreenRender(true), 800);
      })
      .catch(err => {
        console.log(err);
      });
  };

  React.useEffect(() => {
    handleDeviceId();
    appPermission();
  }, []);
  return (
    <NavigationContainer>
      {screenRender && <AppScreenStack />}
      {!screenRender && <SplashScreen />}
    </NavigationContainer>
  );
}

export default App;
