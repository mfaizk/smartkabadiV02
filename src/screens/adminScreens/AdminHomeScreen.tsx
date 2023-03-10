import React from 'react';
import {View, Text, Button} from 'react-native';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';
import {useNavigation} from '@react-navigation/native';

const AdminHomeScreen = () => {
  const currentUser = useSelector((state: RootState) => state.auth);
  const nav = useNavigation();
  return (
    <View>
      <Button title="Admin Logout" onPress={() => signOut(nav)} />
      <Text style={{color: 'black'}}>Hello {currentUser.user?.email}</Text>
    </View>
  );
};

export default AdminHomeScreen;
