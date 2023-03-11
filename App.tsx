import React, {useEffect, useState} from 'react';

import WelcomeScreen from './src/screens/WelcomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignUp from './src/screens/SignUpScreen';
import SignIn from './src/screens/SignInScreen';
import {useDispatch} from 'react-redux';
import HomeScreen from './src/screens/HomeScreen';
// import {RootState} from './src/redux/store/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminSignInScreen from './src/screens/adminScreens/AdminSignInScreen';
import AdminHomeScreen from './src/screens/adminScreens/AdminHomeScreen';
import {defaultHome, homeValue, themeStringKey} from './src/utils/constValues';
import {ActivityIndicator, View} from 'react-native';
import {changeTheme} from './src/redux/reducer/ThemeReducer';
const Stack = createNativeStackNavigator();

const App = () => {
  // const currentAuthState = useSelector((state: RootState) => state.auth.user);
  const [loadingState, setLoadingState] = useState(true);
  const [currentHomeState, setCurrentHomeState] = useState('welcome');
  const dispatch = useDispatch();
  useEffect(() => {
    (async function initialRun() {
      // theme-logic-start-here
      try {
        if (await AsyncStorage.getItem(themeStringKey)) {
          dispatch(
            changeTheme({
              themeNumber:
                Number(await AsyncStorage.getItem(themeStringKey)) || 0,
            }),
          );
        } else {
          await AsyncStorage.setItem(themeStringKey, '0');
        }
      } catch (error) {}
      // theme-logic-end-here

      try {
        if (await AsyncStorage.getItem(defaultHome)) {
          setCurrentHomeState(
            (await AsyncStorage.getItem(defaultHome)) || 'welcome',
          );
          setLoadingState(false);
        } else {
          await AsyncStorage.setItem(defaultHome, homeValue.WELCOME);
          setLoadingState(false);
        }
      } catch (e) {
        await AsyncStorage.setItem(defaultHome, homeValue.WELCOME);
        console.log(e);
      }
    })();
  }, []);

  if (loadingState) {
    return (
      <View
        style={{
          backgroundColor: 'blue',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size={50} color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={currentHomeState}>
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
        <Stack.Screen
          name="home"
          component={HomeScreen}
          options={{headerShown: false}}
        />

        {/* Admin-Route-Start-here */}
        <Stack.Screen
          name="admin-signin"
          component={AdminSignInScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="admin-home"
          component={AdminHomeScreen}
          options={{headerShown: false}}
        />
        {/* Admin-Route-end-here */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
