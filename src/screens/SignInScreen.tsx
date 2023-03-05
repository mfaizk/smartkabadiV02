import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation();
  const submitHandler = (): void => {
    console.log(email);
    console.log(password);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View></View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
