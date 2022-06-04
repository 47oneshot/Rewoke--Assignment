import * as React from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {FAB} from 'react-native-paper';
import {colors, screen_height, screen_width, size} from '../constant/theme';
import firestore from '@react-native-firebase/firestore';

const RNFS = require('react-native-fs');

const VideoListScreen = ({navigation, route}) => {
  const navigateToRecorderScreen = props => navigation.navigate('Recorder');

  const [videoes, setVideos] = React.useState([]);

  firestore()
    .collection('play_list')
    .onSnapshot(doc => {
      let videoList = [];
      doc?.forEach(queryDocumentSnapshot => {
        videoList.push({
          ...queryDocumentSnapshot.data(),
          docId: queryDocumentSnapshot.id,
        });
      });
      setVideos(videoList);
    });

  const handleDelete = async (docID,filepath) => {
    await firestore()
      .collection('play_list')
      .doc(docID)
      .delete()
      .then(() => {
        RNFS.exists(filepath)
          .then(result => {
            console.log('file exists: ', result);

            if (result) {
              return (
                RNFS.unlink(filepath)
                  .then(() => {
                    console.log('FILE DELETED');
                    ToastAndroid.show('Video deleted successfully!', ToastAndroid.SHORT);
                  })
                  .catch(err => {
                    console.log(err.message);
                  })
              );
            }
          })
          .catch(err => {
            console.log(err.message);
          });
      })
      .catch(() =>
        ToastAndroid.show('Opps! something went wrong', ToastAndroid.SHORT),
      );
  };
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.card}>
        <View style={styles.contentTitle}>
          <Text style={styles.title}> Device id : {item?.deviceId}</Text>
          <Text style={styles.jobTitle}>{item.file}</Text>
        </View>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => handleDelete(item?.docId,item?.file)}>
            <Icon
              name={'delete'}
              size={screen_width(8)}
              color={colors.danger}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar
        backgroundColor={colors.primary}
        translucent
        barStyle="light-content"
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={videoes}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        ListEmptyComponent={() => {
          return (
            <View style={styles.emptycontent}>
              <Text style={styles.title}>Opps! your bucket is empty</Text>
            </View>
          );
        }}
      />
      <FAB
        style={styles.fab}
        large
        icon="camera"
        color={colors.white}
        onPress={navigateToRecorderScreen}
      />
    </SafeAreaView>
  );
};

export default VideoListScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.grey,
    paddingHorizontal: size.appSpacing,
  },
  fab: {
    position: 'absolute',
    margin: size.appSpacing,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary,
  },
  card: {
    width: screen_width(100) - 2 * size.appSpacing,
    height: screen_height(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: size.appSpacing,
    marginTop: size.appSpacing,
    borderRadius: size.appSpacing,
  },
  title: {
    fontSize: size.appSpacing,
    color: '#000000',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  content: {
    flexDirection: 'row',
  },
  contentTitle: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  circle: {
    backgroundColor: colors.primary,
    marginRight: size.appSpacing,
    justifyContent: 'center',
    alignItems: 'center',
    padding: size.appSpacing,
    borderRadius: 999,
  },
  circleText: {
    fontSize: size.smallTextFontSize,
    color: colors.black,
    fontWeight: 'bold',
  },
  jobTitle: {
    color: colors.deepGrey,
  },
  emptycontent: {
    flex: 1,
    height: screen_height(30),
    width: '100%',
    borderRadius: size.appSpacing,
    marginVertical: size.appSpacing,
    backgroundColor: colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: size.textFontSize,
    color: colors.black,
    fontWeight: 'bold',
  },
});
