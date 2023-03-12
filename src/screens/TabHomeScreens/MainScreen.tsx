import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {themeState} from '../../redux/reducer/ThemeReducer';
import {Dimensions} from 'react-native';
import Document from 'react-native-document-picker';
import Snackbar from 'react-native-snackbar';
import Permission from 'react-native-permissions';
import {ScrollView} from 'react-native-gesture-handler';

const MainScreen = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState('');
  const [isPermissionAllowed, setIsPermissionAllowed] = useState<
    string | boolean
  >('loading');
  const styles = useMemo(() => createTheme(currentTheme), [currentTheme]);

  const requestCameraPermission = async () => {
    try {
      const granted = await Permission.requestMultiple([
        Permission.PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        Permission.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]);

      if (
        granted['android.permission.READ_EXTERNAL_STORAGE'] !==
          Permission.RESULTS.GRANTED &&
        granted['android.permission.ACCESS_FINE_LOCATION'] !==
          Permission.RESULTS.GRANTED
      ) {
        setIsPermissionAllowed(false);
      } else {
        setIsPermissionAllowed(true);
      }
    } catch (err) {
      setIsPermissionAllowed('loading');
    }
  };
  useMemo(() => {
    requestCameraPermission();
  }, []);

  // const dispatch = useDispatch();

  async function imagePicker() {
    try {
      setisLoading(prev => !prev);
      const fileLoction = await Document.pickSingle({
        copyTo: 'cachesDirectory',
        type: Document.types.images,
      });
      setImage(fileLoction.fileCopyUri || '');

      setisLoading(prev => !prev);
    } catch (e) {
      Snackbar.show({
        text: 'unable to load file',
        backgroundColor: 'red',
        textColor: 'white',
      });
    }
  }

  if (isPermissionAllowed === false) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: currentTheme.primary,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 15}}>Unable to run app without permission</Text>
        <Text style={{fontSize: 15}}>
          Exit app and rerun after giving permission
        </Text>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: currentTheme.textLightXl,
            paddingHorizontal: 45,
            paddingVertical: 5,
            marginTop: 20,
            backgroundColor: currentTheme.secondary,
            borderRadius: 5,
          }}
          onPress={() => {
            Permission.openSettings();
          }}>
          <Text style={{fontSize: 20}}>Open Settings</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (isPermissionAllowed === 'loading') {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size={20} />
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.mainContainer}>
        {image !== '' ? (
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => {
              imagePicker();
            }}>
            <Image source={{uri: image}} style={styles.image} />
          </TouchableOpacity>
        ) : (
          // <></>
          <TouchableOpacity
            style={styles.imageContainer}
            disabled={isLoading}
            onPress={() => {
              imagePicker();
            }}>
            {isLoading ? (
              <ActivityIndicator size={30} />
            ) : (
              <Text style={styles.imageContainerText}>Pick image</Text>
            )}
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => setImage('')}>
          <Text style={styles.dangerButtonText}>Remove Image</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const createTheme = (currentTheme: themeState) => {
  const style = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: currentTheme.textLight,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
    },
    imageContainer: {
      width: Dimensions.get('screen').width * 0.9,
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.primary,
      padding: 10,
    },
    imageContainerText: {
      fontSize: 20,
    },
    image: {
      width: '100%',
      aspectRatio: 1,
      resizeMode: 'contain',
    },
    dangerButton: {
      backgroundColor: 'red',
      width: '82%',
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    dangerButtonText: {
      textAlign: 'center',
      fontSize: 20,
    },
  });

  return style;
};

export default MainScreen;
