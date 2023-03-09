import React from 'react';
import {Button, Text, View} from 'react-native';
import {signOut} from '../utils/firebaseHandler';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import {useNavigation} from '@react-navigation/native';

const HomeScreen = () => {
  const currentUser = useSelector((state: RootState) => state.auth);
  const nav = useNavigation();
  return (
    <View>
      <Button title="Logout" onPress={() => signOut(nav)} />
      <Text style={{color: 'black'}}>Hello {currentUser.user?.email}</Text>
    </View>
  );
};

export default HomeScreen;
