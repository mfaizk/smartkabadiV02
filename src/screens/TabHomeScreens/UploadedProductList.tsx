import React, {useEffect, useMemo, useState} from 'react';
import {Dimensions, Image, StyleSheet, Text, View} from 'react-native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import database from '@react-native-firebase/database';
import {FlatList} from 'react-native-gesture-handler';
import loadingGIF from '../../../assets/loading.gif';

const UploadedProductList = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  const currentUser = useSelector((state: RootState) => state.auth);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  const [listData, setListData] = useState('a');
  const ref = database().ref('/product');
  useEffect(() => {
    ref.once('value').then(snapshot => {
      const data = snapshot.val();
      // console.log(data);

      Object.values(data).forEach(e => {
        const finalData = Object.values(e).filter(
          v => v.authorId === currentUser.user?.uid,
        );

        setListData(finalData);
      });
    });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={typeof listData == 'string' ? [] : listData}
        ItemSeparatorComponent={() => <View style={styles.cardSeprator}></View>}
        renderItem={({item}) => (
          <View style={styles.cardStyle}>
            <Image
              style={styles.cardImage}
              source={{uri: item.imageURL ?? loadingGIF}}
            />
            <Text style={styles.text}>
              <Text style={styles.cardDetailText}>Description: </Text>{' '}
              {item.description}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.cardDetailText}>Address: </Text>
              {item.address}
            </Text>
            <Text style={styles.text}>
              <Text style={styles.cardDetailText}>Category: </Text>{' '}
              {item.category}
            </Text>
          </View>
        )}
      />
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
  });
  return styles;
};
