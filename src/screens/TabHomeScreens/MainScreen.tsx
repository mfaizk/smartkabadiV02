import React, {useMemo, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import {Formik} from 'formik';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {themeState} from '../../redux/reducer/ThemeReducer';
import {Dimensions} from 'react-native';
import Document from 'react-native-document-picker';
import Snackbar from 'react-native-snackbar';
import Permission from 'react-native-permissions';
import {Picker} from '@react-native-picker/picker';
import {productCategory} from '../../utils/constValues';
import GetLocation, {Location} from 'react-native-get-location';
interface formInterface {
  address: string;
  product_description: string;
  category: string;
}

const MainScreen = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [isPermissionAllowed, setIsPermissionAllowed] = useState<
    string | boolean
  >('loading');
  const styles = useMemo(() => createTheme(currentTheme), [currentTheme]);
  const initialValues: formInterface = {
    address: '',
    category: '',
    product_description: '',
  };

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
  function onsubmitForm(values) {
    console.log(values);
  }

  async function getCurrentLocation() {
    setIsPermissionAllowed('loading');
    try {
      const location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 60000,
      });
      setCurrentLocation(location);
      setIsPermissionAllowed(true);
    } catch (error) {
      setIsPermissionAllowed(true);
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
        {/* form-start-here */}
        <Formik initialValues={initialValues} onSubmit={onsubmitForm}>
          {({handleChange, handleBlur, handleSubmit, values}) => (
            <View style={styles.formStyle}>
              <TextInput
                onChangeText={handleChange('address')}
                onBlur={handleBlur('address')}
                value={values.address}
                placeholder="Address"
                style={styles.inputAddressStyle}
                multiline
                textAlignVertical="top"
                numberOfLines={5}
              />
              <TextInput
                onChangeText={handleChange('product_description')}
                onBlur={handleBlur('product_description')}
                value={values.product_description}
                placeholder="Product Description"
                style={styles.inputStyle}
              />
              <Picker
                selectedValue={values.category}
                onValueChange={handleChange('category')}
                onBlur={handleBlur('category')}
                placeholder="Category"
                style={styles.inputStyle}>
                {productCategory.map((e, i) => (
                  <Picker.Item label={e} value={e} key={i} />
                ))}
              </Picker>

              {/* Location-View-start */}
              <View style={styles.locationView}>
                <TouchableOpacity
                  style={styles.locationViewButton}
                  onPress={() => {
                    getCurrentLocation();
                  }}>
                  <Text style={styles.locationViewButtonText}>
                    {currentLocation
                      ? `latitude:${currentLocation.latitude}, longitude:${currentLocation.longitude}`
                      : 'Get Location'}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* Location-View-end */}

              {/* form-end-here */}
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
                onPress={() => {
                  setImage('');
                  setisLoading(false);
                }}>
                <Text style={styles.dangerButtonText}>Remove Image</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.submitButtonStyle}>
                <Text style={styles.dangerButtonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </View>
    </ScrollView>
  );
};

const createTheme = (currentTheme: themeState) => {
  const style = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: currentTheme.primary,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
    },
    imageContainer: {
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.primary,
      padding: 10,
      marginTop: 10,
      minWidth: 330,
      maxWidth: 330,
      height: 200,
    },
    imageContainerText: {
      fontSize: 20,
    },
    image: {
      width: '100%',
      height: 200,
      aspectRatio: 1,
      resizeMode: 'center',
    },
    dangerButton: {
      backgroundColor: 'red',
      minWidth: 330,
      maxWidth: 330,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    dangerButtonText: {
      textAlign: 'center',
      fontSize: 20,
    },
    formStyle: {
      marginTop: 20,
      backgroundColor: currentTheme.primary,
      flex: 1,
      minWidth: Dimensions.get('screen').width * 0.9,
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputAddressStyle: {
      backgroundColor: currentTheme.textLight,
      minWidth: 330,
      maxWidth: 330,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      color: currentTheme.textLightXl,
      fontSize: 20,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    inputStyle: {
      backgroundColor: currentTheme.textLight,
      minWidth: 330,
      maxWidth: 330,
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      color: currentTheme.textLightXl,
      fontSize: 15,
      margin: 5,
      borderRadius: 5,
      paddingHorizontal: 10,
    },
    submitButtonStyle: {
      minWidth: 330,
      maxWidth: 330,
      backgroundColor: currentTheme.tertiary,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 10,
    },
    locationView: {
      backgroundColor: currentTheme.tertiary,
      marginTop: 10,
      borderRadius: 10,
    },
    locationViewButton: {
      minWidth: 330,
      maxWidth: 330,
      paddingVertical: 10,
    },
    locationViewButtonText: {
      textAlign: 'center',
      fontSize: 20,
    },
  });

  return style;
};

export default MainScreen;
