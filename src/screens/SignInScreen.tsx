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
        <View className="min-w-full flex  min-h-[90vh] justify-end items-end">
          <View className="container bg-[#6002ee]  min-h-[400px] flex justify-center items-center rounded-t-2xl">
            <View className="container md:min-w-[500px] md:min-h-[500px] justify-start items-center mx-2  mb-10">
              <TextInput
                className=" p-3 w-[80%] my-4 rounded border-gray-400 border-[1px] text-lg font-sans text-white"
                placeholder="Email"
                placeholderTextColor={'white'}
                cursorColor={'white'}
                value={email}
                onChangeText={e => setEmail(e.trim())}
              />
              <TextInput
                className=" p-3 w-[80%] rounded border-gray-400 border-[1px] text-lg font-sans text-white"
                placeholder="Password"
                placeholderTextColor={'white'}
                cursorColor={'white'}
                value={password}
                onChangeText={e => setPassword(e.trim())}
              />
              <TouchableOpacity
                className="bg-[#0000d6] w-[80%] p-3 mt-14 shadow-2xl "
                onPress={() => {
                  if (password && email) {
                    setPassword('');
                    setEmail('');
                    submitHandler();
                  }
                }}>
                <Text className="text-center text-white text-lg">Login</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-white text-sm ">
              Don't Have an account?
              <Text
                className=" text-gray-300"
                onPress={() => nav.navigate('signup' as never)}>
                {' '}
                Signup Here
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
