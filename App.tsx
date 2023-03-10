import React, {useEffect} from 'react';

import WelcomeScreen from './src/screens/WelcomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUpScreen';
import SignIn from './src/screens/SignInScreen';
import {updateAuthState} from './src/redux/reducer/AuthReducer';
import {useDispatch, useSelector} from 'react-redux';
import auth from '@react-native-firebase/auth';
import HomeScreen from './src/screens/HomeScreen';
import {RootState} from './src/redux/store/store';
const Stack = createNativeStackNavigator();

const App = () => {
  const currentAuthState = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const subs = auth().onAuthStateChanged(e => {
      console.log(currentAuthState);

      if (e?.email) {
        dispatch(updateAuthState({user: e}));
      } else {
        dispatch(updateAuthState({user: null}));
      }
    });
    return subs;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={currentAuthState ? 'home' : 'welcome'}>
        <Stack.Screen
          name="welcome"
          component={WelcomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signin"
          component={SignIn}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="signup"
          component={SignUp}
          options={{headerShown: false}}
        />

        <Stack.Screen name="home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
