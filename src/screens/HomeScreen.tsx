import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MainScreen from './TabHomeScreens/MainScreen';
import SettingScreen from './TabHomeScreens/SettingScreen';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';

/* eslint-disable */
const Tab = createBottomTabNavigator();
const HomeScreen = () => {
  const currentTheme = useSelector((state: RootState) => state.theme);
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {
          backgroundColor: currentTheme.background,
        },
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          let style;
          if (route.name === 'user-home') {
            iconName = focused ? 'home' : 'home-outline';
            style = focused ? 25 : 20;
          } else if (route.name == 'user-setting') {
            iconName = focused ? 'settings' : 'settings-outline';
            style = focused ? 25 : 20;
          }
          return (
            <Icon
              name={iconName || 'reload-outline'}
              size={style}
              color={color}
            />
          );
        },
      })}>
      <Tab.Screen
        name="user-home"
        component={MainScreen}
        options={{
          headerTitle: 'Add Product',
          headerStyle: {backgroundColor: currentTheme.background},
          headerTitleStyle: {color: currentTheme.textLight},
        }}
      />
      <Tab.Screen
        name="user-setting"
        component={SettingScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default HomeScreen;
