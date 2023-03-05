import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import {themeDataDark1, themeDataLight1} from '../configs/themeData';

const currentTheme = themeDataDark1 || themeDataLight1;
const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;
const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView>
      <View style={styles.body}>
        <View style={styles.textBody}>
          <Text style={styles.heading}>Welcome</Text>
          <Text style={[styles.defaultText, styles.subHeading]}>
            Manage Your Kabad Here
          </Text>
          <Text style={[styles.defaultText, styles.subHeadingBold]}>
            seamlessly & intuitively
          </Text>
        </View>
        <View>
          <TouchableOpacity style={styles.loginButton}>
            <Text style={[styles.defaultText]}>Sign in with Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginButton,
              {backgroundColor: currentTheme.primary},
            ]}>
            <Text style={[styles.defaultText]}>Create an account</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.defaultText, styles.footerText]}>
          Are you kabadivala? {'  '}SignIn
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: currentTheme.primary,
    display: 'flex',
    height: Dimensions.get('screen').height - statusBarHeight,
    width: Dimensions.get('screen').width,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 100,
    textAlign: 'right',
  },
  textBody: {
    minWidth: 300,
  },
  defaultText: {
    color: currentTheme.text,
  },
  heading: {
    fontSize: 40,
    fontWeight: 'bold',
    color: currentTheme.text,
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 12,
  },
  subHeadingBold: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 50,
  },

  loginButton: {
    minHeight: 40,
    borderWidth: 1,
    borderColor: 'white',
    minWidth: 300,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: currentTheme.tertiary,
    marginBottom: 10,
  },
  footerText: {
    alignSelf: 'center',
    marginTop: 15,
  },
});

export default WelcomeScreen;
