import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import database from '@react-native-firebase/database';
import {FlatList} from 'react-native-gesture-handler';
import loadingGIF from '../../../assets/loading.gif';
import Icon from 'react-native-vector-icons/Feather';
import {
  Card,
  CardTitle,
  CardContent,
  CardAction,
  CardButton,
  CardImage,
} from 'react-native-material-cards';

const UploadedProductList = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const currentUser = useSelector((state: RootState) => state.auth);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  const [listData, setListData] = useState('a');
  const [listUp, setListUp] = useState(false);
  const ref = database().ref('/product');
  useEffect(() => {
    lisUpdater();
  }, []);

  function lisUpdater() {
    ref.once('value').then(snapshot => {
      const data = snapshot.val();
      // console.log(data);
      if (!data) {
        setListData('a');
      } else {
        Object.values(data).forEach(e => {
          const finalData = Object.values(e).filter(
            v => v.authorId === currentUser.user?.uid,
          );

          setListData(finalData);
          // console.log('dataaaaa');
        });
      }
    });
  }
  async function removeItem(item) {
    await database().ref(`product/${item.authorId}/${item.uid}`).remove();
    lisUpdater();
  }

  if (listData == 'a' || listData == []) {
    return (
      <View
        style={[
          styles.mainContainer,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <Text style={{fontSize: 15, color: currentTheme.quaternary}}>
          No Product Added
        </Text>
        <TouchableOpacity
          style={styles.FABContainer}
          onPress={() => {
            setListData('loading');
            lisUpdater();
          }}>
          <Icon name="refresh-ccw" size={40} color={currentTheme.background} />
        </TouchableOpacity>
      </View>
    );
  }
  if (listData == 'loading') {
    return (
      <View
        style={[
          styles.mainContainer,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        <ActivityIndicator size={25} />
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={typeof listData == 'string' ? [] : listData}
        ItemSeparatorComponent={() => <View style={styles.cardSeprator}></View>}
        renderItem={({item}) => (
          // <View style={styles.cardStyle}>
          //   <Image
          //     style={styles.cardImage}
          //     source={{uri: item.imageURL ?? loadingGIF}}
          //   />
          //   <Text style={styles.text}>
          //     <Text style={styles.cardDetailText}>Description: </Text>{' '}
          //     {item.description}
          //   </Text>
          //   <Text style={styles.text}>
          //     <Text style={styles.cardDetailText}>Address: </Text>
          //     {item.address}
          //   </Text>
          //   <Text style={styles.text}>
          //     <Text style={styles.cardDetailText}>Category: </Text>{' '}
          //     {item.category}
          //   </Text>
          // </View>
          <Card>
            <CardImage
              source={{uri: item.imageURL}}
              title={item.product_name}
            />
            <CardContent text={`Address: ${item.address}`} />
            <CardContent text={`Category: ${item.category}`} />
            <CardAction separator={true} inColumn={false}>
              {/* <CardButton onPress={() => {}} title="Push" color="blue" /> */}
              <CardButton
                onPress={() => {
                  removeItem(item);
                }}
                title="Delete"
                color="red"
              />
            </CardAction>
          </Card>
        )}
      />
      <TouchableOpacity
        style={styles.FABContainer}
        onPress={() => {
          setListData('a');
          lisUpdater();
        }}>
        <Icon name="refresh-ccw" size={40} color={currentTheme.background} />
      </TouchableOpacity>
    </View>
  );
};

export default UploadedProductList;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({
    mainContainer: {
      paddingVertical: 10,
      paddingHorizontal: 5,
      backgroundColor: currentTheme.background,
      height: Dimensions.get('window').height,
    },
    cardSeprator: {
      height: 10,
      backgroundColor: currentTheme.background,
    },
    cardStyle: {
      padding: 10,
      borderRadius: 10,
      elevation: 2,
      backgroundColor: currentTheme.background,
    },
    text: {
      color: currentTheme.quaternary,
      backgroundColor: currentTheme.background,
    },
    cardImage: {
      height: 100,
    },
    cardDetailText: {
      color: currentTheme.quaternary,
      fontWeight: '400',
      fontSize: 18,
    },
    FABContainer: {
      backgroundColor: 'green',
      position: 'absolute',
      height: 60,
      width: 60,
      zIndex: 10,
      bottom: 100,
      right: 10,
      borderRadius: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
  return styles;
};
