import React, {useEffect, useMemo} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';
import {useNavigation} from '@react-navigation/native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import database from '@react-native-firebase/database';
import {initialDataEntry} from '../../redux/reducer/AdminDataListReducer';
import {FlatList} from 'react-native-gesture-handler';
const AdminHomeScreen = () => {
  const currentUser = useSelector((state: RootState) => state.auth);
  const currentTheme = useSelector((state: RootState) => state.theme);
  const DataList = useSelector((state: RootState) => state.adminDataList);
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);

  const nav = useNavigation();
  useEffect(() => {
    (async () => {
      try {
        const data = await database().ref('/product').once('value');

        // dispatch(initialDataEntry(Object.values(data.val())));
        Object.values(data.val()).forEach(e => {
          dispatch(initialDataEntry(Object.values(e)));
        });
        // console.log(DataList);
      } catch (error) {}
    })();
    // console.log(DataList);
  }, []);

  if (DataList.length <= 0) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }
  // console.log(DataList);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity style={styles.FABlogut}>
        <Icon
          name="logout"
          size={30}
          style={styles.FABlogutIcon}
          onPress={() => signOut(nav)}
        />
      </TouchableOpacity>

      <FlatList
        data={DataList}
        keyExtractor={item => item.imageURL}
        renderItem={({item}) => (
          <View style={styles.card}>
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
          </View>
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
      backgroundColor: currentTheme.secondary,
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
  });
  return styles;
};
