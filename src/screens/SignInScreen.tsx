import React from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const SignIn = () => {
  return (
    <ScrollView>
      <View className="  min-w-full min-h-screen flex justify-center items-center">
        <Text className="text-2xl font-semibold text-gray-500 text-center mt-10">
          User Login
        </Text>
        <View className="container bg-gray-500 mt-auto min-h-[80%] flex justify-center items-center rounded-t-2xl">
          <View className="container justify-start items-center mx-2  mb-10">
            <TextInput
              className=" p-3 w-[80%] my-4 rounded border-gray-400 border-[1px] text-lg font-sans text-white"
              placeholder="Email"
              placeholderTextColor={'white'}
            />
            <TextInput
              className=" p-3 w-[80%]  rounded border-gray-400 border-[1px] text-lg font-sans text-white"
              placeholder="Password"
              placeholderTextColor={'white'}
            />
            <TouchableOpacity className="bg-gray-600 w-[80%] p-3 mt-14 shadow-2xl border border-gray-700">
              <Text className="text-center text-white text-lg">Login</Text>
            </TouchableOpacity>
          </View>
          <Text className="text-center text-white text-sm ">
            Don't Have an account?
            <Text className=" text-gray-300"> Signup Here</Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignIn;
