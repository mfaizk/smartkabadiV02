import React, {useEffect, useMemo} from 'react';
import {View, Text, Button, ActivityIndicator, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';
import {useNavigation} from '@react-navigation/native';
import {themeState} from '../../redux/reducer/ThemeReducer';
import database from '@react-native-firebase/database';
import {initialDataEntry} from '../../redux/reducer/AdminDataListReducer';
import {productData} from '../../redux/reducer/AdminDataListReducer';
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
        data.forEach(e => {
          dispatch(
            initialDataEntry({
              address: e.val().address,
              category: e.val().category,
              description: e.val().description,
              imageURL: e.val().imageURL,
              latitude: e.val().latitude,
              longitude: e.val().longitude,
            }),
          );
        });
      } catch (error) {}
    })();
    console.log(DataList);
  }, []);

  if (DataList[0].address) {
    return (
      <View>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View>
      <Button title="Admin Logout" onPress={() => signOut(nav)} />
      <Text style={{color: 'black'}}>Hello {currentUser.user?.email}</Text>
      {DataList.map(e => {
        return <Text key={e.address}> Text {e.address}</Text>;
      })}
    </View>
  );
};

export default AdminHomeScreen;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({});
  return styles;
};
