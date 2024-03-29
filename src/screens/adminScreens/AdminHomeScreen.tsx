import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  Pressable,
  Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';
import {useNavigation} from '@react-navigation/native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import database from '@react-native-firebase/database';
import {initialDataEntry} from '../../redux/reducer/AdminDataListReducer';
import {FlatList} from 'react-native-gesture-handler';
import {Alert} from 'react-native';
import {Dimensions} from 'react-native';
import openMap from 'react-native-open-maps';
import Feather from 'react-native-vector-icons/Feather';
import {productStatus} from '../../utils/constValues';
import Snackbar from 'react-native-snackbar';
const AdminHomeScreen = () => {
  const currentUser = useSelector((state: RootState) => state.auth);
  const currentTheme = useSelector((state: RootState) => state.theme);
  const DataList = useSelector((state: RootState) => state.adminDataList);
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const nav = useNavigation();
  useEffect(() => {
    (async () => {
      try {
        const data = await database().ref('/product').once('value');

        // dispatch(initialDataEntry(Object.values(data.val())));
        Object.values(data.val()).forEach(e => {
          dispatch(
            initialDataEntry(
              Object.values(e).filter(e => e.status == productStatus.ACTIVE),
            ),
          );
        });

        // console.log(DataList);
      } catch (error) {}
    })();
    // console.log(DataList);
  }, []);

  async function dataRefresher() {
    try {
      const data = await database().ref('/product').once('value');

      // dispatch(initialDataEntry(Object.values(data.val())));
      Object.values(data.val()).forEach(e => {
        dispatch(
          initialDataEntry(
            Object.values(e).filter(e => e.status == productStatus.ACTIVE),
          ),
        );
      });

      // console.log(DataList);
    } catch (error) {}
  }

  if (DataList.length <= 0) {
    return (
      <View style={{height: Dimensions.get('screen').height * 0.85}}>
        <Text>No data exist</Text>
        <TouchableOpacity style={styles.FABlogut}>
          <Icon
            name="logout"
            size={30}
            style={styles.FABlogutIcon}
            onPress={() => signOut(nav)}
          />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.FABlogut, styles.FABTaskListIcon]}>
          <Entypo
            name="list"
            size={30}
            style={styles.FABlogutIcon}
            onPress={() => nav.navigate('admin-task' as never)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.FABlogut,
            {bottom: 150, backgroundColor: currentTheme.primary},
          ]}>
          <Feather
            name="refresh-ccw"
            size={30}
            style={styles.FABlogutIcon}
            onPress={() => {
              dataRefresher();
            }}
          />
        </TouchableOpacity>
      </View>
    );
  }
  // console.log(DataList);

  const taskAccept = item => {
    database()
      .ref(`/product/${currentUser.user?.uid}/${modalData.uid}`)
      .update({status: productStatus.ACCEPTED})
      .then(() => {
        Snackbar.show({
          duration: Snackbar.LENGTH_SHORT,
          textColor: currentTheme.text,
          backgroundColor: currentTheme.background,
          text: 'Task Accepted',
        });
        dataRefresher();
        setIsModalOpen(!isModalOpen);
      })
      .catch(e => {
        Snackbar.show({
          duration: Snackbar.LENGTH_SHORT,
          textColor: currentTheme.text,
          backgroundColor: currentTheme.background,
          text: e.message || 'Unable to accept',
        });
        setIsModalOpen(!isModalOpen);
      });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Modal-start-here */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setIsModalOpen(!isModalOpen);
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.heading}>Detail</Text>
          <Image source={{uri: modalData.imageURL}} style={styles.modalImage} />
          <View>
            <Text style={styles.modalTitle}>
              Name:{' '}
              <Text style={styles.modalSubtitle}>{modalData.product_name}</Text>
            </Text>
            <Text style={styles.modalTitle}>
              Description:{' '}
              <Text style={styles.modalSubtitle}>{modalData.description}</Text>
            </Text>
            <Text style={styles.modalTitle}>
              Category:{' '}
              <Text style={styles.modalSubtitle}>{modalData.category}</Text>
            </Text>
            <Text style={styles.modalTitle}>
              Address:{' '}
              <Text style={styles.modalSubtitle}>{modalData.address}</Text>
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.mapButton,
                  styles.closeModalButton,
                  {backgroundColor: 'green'},
                ]}
                onPress={() => {
                  if (modalData.status == productStatus.ACTIVE) {
                    taskAccept(modalData);
                  } else {
                    Snackbar.show({
                      text: 'Task is already accepted',
                      backgroundColor: 'yellow',
                      textColor: currentTheme.background,
                    });
                  }
                }}>
                {modalData.status == productStatus.ACTIVE ? (
                  <>
                    <Text style={styles.buttonText}>Accept </Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={[styles.buttonText, {backgroundColor: '#42f572'}]}>
                      Already acccepted{' '}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* <TouchableOpacity
                style={styles.mapButton}
                onPress={() => {
                  try {
                    // openMap({
                    //   provider: 'google',
                    //   navigate: true,
                    //   waypoints: [modalData.address],
                    //   latitude: modalData.latitude,
                    //   longitude: modalData.longitude,
                    // });
                    Linking.openURL(
                      `google.navigation:q=${modalData.latitude}+${modalData.longitude}`,
                    );
                    // console.log('clicked');
                  } catch (error) {
                    console.log(error.message);
                  }
                }}> */}
              {/* <Text style={styles.buttonText}>Open Map</Text>
              </TouchableOpacity> */}
            </View>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => setIsModalOpen(!isModalOpen)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal-end-here */}
      <TouchableOpacity style={styles.FABlogut}>
        <Icon
          name="logout"
          size={30}
          style={styles.FABlogutIcon}
          onPress={() => signOut(nav)}
        />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.FABlogut, styles.FABTaskListIcon]}>
        <Entypo
          name="list"
          size={30}
          style={styles.FABlogutIcon}
          onPress={() => nav.navigate('admin-task' as never)}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.FABlogut,
          {bottom: 150, backgroundColor: currentTheme.primary},
        ]}>
        <Feather
          name="refresh-ccw"
          size={30}
          style={styles.FABlogutIcon}
          onPress={() => {
            dataRefresher();
          }}
        />
      </TouchableOpacity>

      <FlatList
        data={DataList}
        keyExtractor={item => item.imageURL}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setModalData(item);
              setIsModalOpen(!isModalOpen);
            }}
            style={styles.card}>
            <Image
              style={styles.cardImage}
              source={{uri: item.imageURL || 'https://placehold.co/600x400'}}
            />
            <View style={styles.cardTextContainer}>
              <Text style={styles.textStyle}>
                Product Name:
                <Text style={styles.textStyleAns}> {item.product_name}</Text>
              </Text>
              <Text style={styles.textStyle}>
                Description:
                <Text style={styles.textStyleAns}> {item.description}</Text>
              </Text>
              <Text style={styles.textStyle}>
                category:
                <Text style={styles.textStyleAns}> {item.category}</Text>
              </Text>
              <Text style={styles.textStyle}>
                Address:
                <Text style={styles.textStyleAns}>
                  {item.address.substring(0, 30) + '...'}
                </Text>
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default AdminHomeScreen;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({
    mainContainer: {
      display: 'flex',
      backgroundColor: currentTheme.background,
      height: '100%',
    },
    card: {
      display: 'flex',
      backgroundColor: '#5A20CB',
      opacity: 0.7,
      width: '95%',
      padding: 10,
      flexDirection: 'row',
      gap: 10,
      marginHorizontal: 10,
      borderRadius: 10,
      elevation: 10,
      borderColor: currentTheme.textLight,
      marginVertical: 5,
    },
    cardImage: {
      aspectRatio: '1',
      width: '25%',
      backgroundColor: 'blue',
      borderRadius: 10,
    },
    cardTextContainer: {
      display: 'flex',
      width: '70%',
      height: '100%',
      padding: 10,
    },
    textStyle: {
      color: currentTheme.textLightXl,
    },
    textStyleAns: {
      color: currentTheme.text,
    },
    FABlogut: {
      backgroundColor: 'red',
      position: 'absolute',
      bottom: 10,
      right: 10,
      height: 60,
      width: 60,
      borderRadius: 140,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
      elevation: 10,
    },
    FABlogutIcon: {
      color: currentTheme.background,
    },
    FABTaskListIcon: {
      backgroundColor: 'green',
      bottom: 80,
    },

    // Modal-style-start-here
    modalContainer: {
      height: Dimensions.get('window').height * 0.75,
      backgroundColor: currentTheme.textLightXl,
      position: 'relative',
      top: Dimensions.get('window').height * 0.2,
      padding: 10,
      margin: 10,
      borderRadius: 10,
    },
    modalImage: {
      aspectRatio: 3 / 2,
    },
    modalTitle: {
      fontWeight: '500',
      color: currentTheme.tertiary,
      fontSize: 18,
    },
    modalSubtitle: {
      fontWeight: '500',
      color: currentTheme.primary,
      fontSize: 14,
    },
    heading: {
      alignSelf: 'center',
      fontSize: 18,
      padding: 10,
      color: currentTheme.primary,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 20,
    },
    mapButton: {
      backgroundColor: currentTheme.tertiary,
      alignSelf: 'center',
      color: currentTheme.text,
      paddingHorizontal: 18,
      paddingVertical: 10,
      marginTop: 15,
      borderRadius: 10,
      width: 150,
    },
    buttonText: {
      color: currentTheme.text,
      alignSelf: 'center',
    },
    closeModalButton: {
      backgroundColor: 'red',
      marginTop: 20,
      padding: 10,
      width: 300,
      alignSelf: 'center',
      borderRadius: 10,
    },
    // Modal-style-end-here
  });
  return styles;
};
