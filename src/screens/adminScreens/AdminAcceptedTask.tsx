import {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import database from '@react-native-firebase/database';
import {useDispatch, useSelector} from 'react-redux';
import {productStatus} from '../../utils/constValues';
import {FlatList} from 'react-native-gesture-handler';
import Snackbar from 'react-native-snackbar';
const AdminAcceptedTask = () => {
  const [DataList, setDataList] = useState('a');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  useEffect(() => {
    (async () => {
      try {
        const data = await database().ref('/product').once('value');

        // dispatch(initialDataEntry(Object.values(data.val())));
        Object.values(data.val()).forEach(e => {
          setDataList(
            Object.values(e).filter(e => e.status == productStatus.ACCEPTED),
          );
        });

        // console.log(DataList);
      } catch (error) {}
    })();
    // dataRefresher();
  }, []);

  const dataRefresher = async () => {
    try {
      const data = await database().ref('/product').once('value');

      // dispatch(initialDataEntry(Object.values(data.val())));
      Object.values(data.val()).forEach(e => {
        setDataList(
          Object.values(e).filter(e => e.status == productStatus.ACCEPTED),
        );
      });

      // console.log(DataList);
    } catch (error) {}
  };

  function markCompleted() {
    // console.log();

    database()
      .ref(`/product/${modalData.authorId}/${modalData.uid}`)
      .update({status: productStatus.COMPLETED})
      .then(() => {
        Snackbar.show({
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
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
  }

  // async function dataRefresher() {
  //   try {
  //     database()
  //       .ref('/product')
  //       .on('child_added', snapshot => {
  //         Object.values(snapshot.val()).forEach(e => {
  //           setDataList(
  //             Object.values(e).filter(v => v.status == productStatus.ACCEPTED),
  //           );
  //         });
  //       });

  //     // dispatch(initialDataEntry(Object.values(data.val())));

  //     // console.log(DataList);
  //   } catch (error) {}
  // }
  if (DataList === 'a') {
    <View style={{height: Dimensions.get('screen').height}}>
      <ActivityIndicator size={30} />
    </View>;
  }
  if (DataList.length > 0) {
    return (
      <View>
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
            <Image
              source={{uri: modalData.imageURL}}
              style={styles.modalImage}
            />
            <View>
              <Text style={styles.modalTitle}>
                Name:{' '}
                <Text style={styles.modalSubtitle}>
                  {modalData.product_name}
                </Text>
              </Text>
              <Text style={styles.modalTitle}>
                Description:{' '}
                <Text style={styles.modalSubtitle}>
                  {modalData.description}
                </Text>
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
                    Linking.openURL(
                      `google.navigation:q=${modalData.latitude}+${modalData.longitude}`,
                    );
                  }}>
                  <Text style={styles.buttonText}>Open Map</Text>
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
                style={[styles.closeModalButton, {backgroundColor: 'blue'}]}
                onPress={() => markCompleted()}>
                <Text style={styles.buttonText}>Completed</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setIsModalOpen(!isModalOpen)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* Modal-end-here */}
        <FlatList
          data={DataList}
          keyExtractor={item => item.uid}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => {
                setModalData(item), setIsModalOpen(!isModalOpen);
              }}
              style={styles.listContainer}>
              <View style={styles.photoContainer}>
                <Image source={{uri: item.imageURL}} style={styles.listPhoto} />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.title}>
                  <Text style={styles.titleHeading}>Name:</Text>{' '}
                  {item.product_name}
                </Text>
                <Text style={styles.subtitle}>
                  <Text style={styles.titleSubHeading}>Category:</Text>{' '}
                  {item.category}
                </Text>
                <Text style={styles.subtitle}>
                  <Text style={styles.titleSubHeading}>Status:</Text>{' '}
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  console.log(DataList);

  return (
    <View
      style={{
        height: Dimensions.get('screen').height,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{fontSize: 20, color: '#111'}}>No Task Remaining</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    height: 100,
    width: Dimensions.get('window').width * 0.97,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    margin: 5,
    elevation: 1,
    borderRadius: 10,
    backgroundColor: '#CAD5E2',
  },
  photoContainer: {
    // backgroundColor: 'green',
    height: 80,
    width: Dimensions.get('screen').width * 0.2,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    // backgroundColor: 'red',
    height: 80,
    width: Dimensions.get('screen').width * 0.7,
    gap: 7,
  },
  listPhoto: {
    height: 70,
    width: 70,
    borderRadius: 50,
  },
  title: {
    color: '#758283',
    fontSize: 13,
  },
  subtitle: {
    color: '#758283',
    fontSize: 13,
  },
  titleHeading: {
    color: '#242B2E',
    fontSize: 15,
  },
  titleSubHeading: {
    color: '#242B2E',
    fontSize: 15,
  },

  // Modal-style-start-here
  modalContainer: {
    height: Dimensions.get('window').height * 0.9,
    width: Dimensions.get('window').width * 0.95,
    backgroundColor: '#CAD5E2',
    position: 'absolute',
    bottom: 0,
    padding: 10,
    // margin: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  modalImage: {
    aspectRatio: 3 / 2,
  },
  modalTitle: {
    fontWeight: '500',
    color: '#242B2E',
    fontSize: 18,
    marginTop: 10,
  },
  modalSubtitle: {
    fontWeight: '500',
    color: '#242B2E',
    fontSize: 14,
  },
  heading: {
    alignSelf: 'center',
    fontSize: 18,
    padding: 10,
    // color: currentTheme.primary,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  mapButton: {
    // backgroundColor: currentTheme.tertiary,
    alignSelf: 'center',
    // color: currentTheme.text,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 15,
    borderRadius: 10,
    width: 150,
  },
  buttonText: {
    color: '#fff',
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

export default AdminAcceptedTask;
