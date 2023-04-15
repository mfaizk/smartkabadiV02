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
import database from '@react-native-firebase/database';
import * as Yup from 'yup';
import storage from '@react-native-firebase/storage';
interface formInterface {
  address: string;
  product_description: string;
  category: string;
  product_name: string;
}

const ProductSchema = Yup.object().shape({
  address: Yup.string()
    .min(15, 'Too short')
    .max(300, 'Too Long')
    .required('Address Required'),
  product_description: Yup.string()
    .min(15, 'Too short')
    .max(300, 'Too Long')
    .required('Description Required'),
  category: Yup.string().required('Category Required'),
  product_name: Yup.string().required('Name Required'),
});

const MainScreen = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const currentUser = useSelector((state: RootState) => state.auth);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location>();
  const [isPermissionAllowed, setIsPermissionAllowed] = useState<
    string | boolean
  >('loading');
  const styles = useMemo(() => createTheme(currentTheme), [currentTheme]);
  const initialValues: formInterface = {
    address: '',
    category: '',
    product_description: '',
    product_name: '',
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
      setImageName(fileLoction.name || '');
      setisLoading(prev => !prev);
    } catch (e) {
      Snackbar.show({
        text: 'unable to load file',
        backgroundColor: 'red',
        textColor: 'white',
      });
      setImage('');
      setImageName('');
      setisLoading(prev => !prev);
    }
  }
  const onsubmitForm = (values: formInterface, resetForm) => {
    if (
      currentLocation?.latitude &&
      image &&
      values.address &&
      values.category &&
      values.product_description &&
      values.product_name
    ) {
      setIsUploading(true);

      const ref = storage().ref(Date.now() + imageName);
      ref.putFile(image).then(() => {
        ref.getDownloadURL().then(imgURL => {
          database()
            .ref(`/product/${Date.now()}`)
            .set({
              address: values.address,
              category: values.category,
              description: values.product_description,
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              imageURL: imgURL,
              product_name: values.product_name,
              authorId: currentUser.user?.uid || 'a',
            })
            .then(() => {
              setIsUploading(false);
              setImage('');
              setCurrentLocation(undefined);
              resetForm();

              Snackbar.show({
                text: 'Data uploaded Sucessfull',
                backgroundColor: 'green',
                textColor: 'white',
              });
            })
            .catch(e => {
              Snackbar.show({
                text: e.message || 'error occured while uploading',
                backgroundColor: 'red',
                textColor: 'white',
              });
              setIsUploading(false);
            });
        });
      });
    } else {
      Snackbar.show({
        text: 'All field required',
        backgroundColor: 'red',
        textColor: 'white',
      });
      setisLoading(false);
    }
  };

  async function getCurrentLocation() {
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
        {isUploading ? (
          <>
            <ActivityIndicator
              size={50}
              style={styles.loadingIndicator}></ActivityIndicator>
          </>
        ) : (
          <></>
        )}
        {/* form-start-here */}
        <Formik
          initialValues={initialValues}
          validationSchema={ProductSchema}
          onSubmit={async (values, {resetForm}) => {
            onsubmitForm(values, resetForm);
          }}
          // validationSchema={ProductSchema}
        >
          {({handleChange, handleBlur, handleSubmit, values, errors}) => (
            <View style={styles.formStyle}>
              <TextInput
                onChangeText={handleChange('product_name')}
                onBlur={handleBlur('product_name')}
                value={values.product_name}
                placeholder="Product Name"
                style={styles.inputStyle}
              />
              {errors.product_description && (
                <Text style={styles.errorStyle}>{errors.product_name}</Text>
              )}
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
              {errors.address && (
                <Text style={styles.errorStyle}>{errors.address}</Text>
              )}

              <TextInput
                onChangeText={handleChange('product_description')}
                onBlur={handleBlur('product_description')}
                value={values.product_description}
                placeholder="Product Description"
                style={styles.inputStyle}
              />
              {errors.product_description && (
                <Text style={styles.errorStyle}>
                  {errors.product_description}
                </Text>
              )}
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
              {errors.category && (
                <Text style={styles.errorStyle}>{errors.category}</Text>
              )}
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
      backgroundColor: currentTheme.background,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingVertical: 10,
      height: '100%',
    },
    imageContainer: {
      borderRadius: 10,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.quaternary,
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
      backgroundColor: currentTheme.background,
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
    errorStyle: {
      color: 'red',
      minWidth: 330,
      maxWidth: 330,
    },
    loadingIndicator: {
      position: 'absolute',
      zIndex: 10,
      height: '100%',
      width: '100%',
    },
  });

  return style;
};

export default MainScreen;
