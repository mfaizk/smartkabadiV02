import React from 'react';

import WelcomeScreen from './src/screens/WelcomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUpScreen';
import SignIn from './src/screens/SignInScreen';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signin"
          component={SignIn}
          options={{
            headerTitle: 'User Signin',
            headerShadowVisible: false,
            headerTintColor: 'gray',
            headerTitleAlign: 'center',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{
            headerTitle: 'User Signup',
            headerShadowVisible: false,
            headerTintColor: 'gray',
            headerTitleAlign: 'center',
            headerBackVisible: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
