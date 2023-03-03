import React from 'react';

import {View, Text, TouchableOpacity} from 'react-native';

const App = () => {
  return (
    <View className="container mx-auto flex-1 justify-center items-center flex-col mt-[150px] ">
      <Text className="text-gray-600 text-2xl">Welcome To SmartKabadi</Text>
      <View className="mt-auto">
        <TouchableOpacity className="bg-purple-700 w-[300px] py-[10px] rounded  ">
          <Text className="text-white text-lg text-center">SignIn</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-purple-700 w-[300px] py-[10px] rounded mt-[25px]">
          <Text className="text-white text-lg text-center">SignUp</Text>
        </TouchableOpacity>
        <TouchableOpacity className="w-[300px]  py-[10px] rounded mt-[100px] font-sans border border-gray-600 mb-[50px]">
          <Text className="text-gray-600 text-lg text-center">Admin login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
