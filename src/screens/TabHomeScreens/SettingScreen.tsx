import React, {useMemo} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {changeTheme, themeState} from '../../redux/reducer/ThemeReducer';
import {RootState} from '../../redux/store/store';
import {signOut} from '../../utils/firebaseHandler';
import SwitchSelector from 'react-native-switch-selector';
import Icon from 'react-native-vector-icons/AntDesign';

const SettingScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const currentTheme = useSelector((state: RootState) => state.theme);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  const option = [
    {label: 'Light', value: 0},
    {label: 'Dark', value: 1},
  ];
  return (
    <View style={styles.mainContainer}>
      <View style={styles.themeChangerContainer}>
        <Text style={styles.themeChangerText}>ThemeChnager</Text>
        <SwitchSelector
          options={option}
          initial={0}
          onPress={val => dispatch(changeTheme({themeNumber: val}))}
        />
      </View>

      <View style={styles.logoutContainer}>
        <Text style={styles.text}>SignOut</Text>
        <TouchableOpacity
          onPress={() => {
            signOut(navigation);
            // console.log('Runned');
          }}
          style={styles.logoutButton}>
          <Icon name="logout" size={25} color={'white'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SettingScreen;

const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: currentTheme.background,
      height: Dimensions.get('window').height,
    },
    themeChangerContainer: {
      backgroundColor: currentTheme.quaternary,
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      padding: 10,
      borderRadius: 15,
      elevation: 10,
    },
    themeChangerText: {
      color: currentTheme.background,
      fontSize: 17,
      marginBottom: 10,
      alignSelf: 'flex-start',
      marginLeft: 10,
    },
    logoutButton: {
      backgroundColor: 'red',
      width: 60,
      height: 60,
      borderRadius: 45,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
    },
    logoutContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
      padding: 10,
      paddingHorizontal: 25,
      backgroundColor: currentTheme.quaternary,
      borderRadius: 15,
      elevation: 10,
    },
    text: {
      color: currentTheme.text,
      fontSize: 18,
    },
  });
  return styles;
};
