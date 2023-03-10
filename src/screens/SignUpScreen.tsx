import {useNavigation} from '@react-navigation/native';
import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  StatusBar,
  // ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {signUpWithEmailAndPassword} from '../utils/firebaseHandler';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store/store';
import AnimatedButton from './component/AnimatedButton';
import Snackbar from 'react-native-snackbar';
import {themeState} from '../redux/reducer/ThemeReducer';

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cnfPassword, setCnfPassword] = useState('');
  const [isObsecure, setisObsecure] = useState(true);
  const nav = useNavigation();
  const loadingState = useSelector((state: RootState) => state.loading);
  const currentTheme = useSelector((state: RootState) => state.theme);
  const styles = useMemo(() => createStyle(currentTheme), [currentTheme]);
  const submitHandler = (): void => {
    if (email && password && cnfPassword) {
      // setClick(true);
      if (password === cnfPassword) {
        signUpWithEmailAndPassword(email, password, nav);
        setEmail('');
        setPassword('');
        setCnfPassword('');
      } else {
        setPassword('');
        setCnfPassword('');
        Snackbar.show({
          text: "Password don't match",
          textColor: 'white',
          backgroundColor: 'red',
          duration: Snackbar.LENGTH_SHORT,
        });
      }
    }
  };

  // if (loadingState.loading) {
  //   return <LoadingScreen indicatorColor={currentTheme.primary} />;
  // }

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.hedaing}>Sign up</Text>
          <View style={styles.formCard}>
            <View style={styles.formTextCardView}>
              <Text style={styles.cardHeading}>Welcome Stranger</Text>
              <Text style={styles.subCardHeading}>
                Hello there, sign up to continue
              </Text>
            </View>
            <View style={styles.formCardInputView}>
              <Text style={styles.inputHeading}>Email</Text>
              <TextInput
                style={styles.input}
                value={email.trim()}
                onChangeText={e => setEmail(e.trim())}
                keyboardType="email-address"
              />
              <Text style={styles.inputHeading}>Password</Text>
              <View style={[styles.input, styles.passwordView]}>
                <TextInput
                  secureTextEntry={isObsecure}
                  style={styles.passwordInput}
                  value={password.trim()}
                  onChangeText={e => setPassword(e.trim())}
                />
                <Icon
                  name={isObsecure ? 'eye-off' : 'eye'}
                  size={25}
                  color="#111111"
                  style={styles.inputIcon}
                  onPress={() => setisObsecure(prev => !prev)}
                />
              </View>
              {/* confirm-password-view-start */}
              <Text style={styles.inputHeading}>Confirm Password</Text>

              <View style={[styles.input, styles.passwordView]}>
                <TextInput
                  secureTextEntry={true}
                  style={styles.passwordInput}
                  value={cnfPassword.trim()}
                  onChangeText={e => setCnfPassword(e.trim())}
                />
              </View>
              {/* confirm-password-view-end */}

              <TouchableOpacity
                disabled={loadingState.loading}
                onPress={() => {
                  if (email && password && cnfPassword) {
                    submitHandler();
                  } else {
                    Snackbar.show({
                      text: 'All field Required',
                      backgroundColor: 'red',
                      textColor: 'white',
                      duration: Snackbar.LENGTH_SHORT,
                    });
                  }
                  // dispatch(changeTheme({themeNumber: 0}));
                }}>
                <AnimatedButton
                  currentTheme={currentTheme}
                  buttonText={'Signin'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              Have an accoun?
              <Text
                style={{color: currentTheme.primary}}
                onPress={() => nav.navigate('signin' as never)}>
                Sign in
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const createStyle = (currentTheme: themeState) => {
  const styles = StyleSheet.create({
    body: {
      minHeight: Dimensions.get('screen').height - statusBarHeight,
      minWidth: Dimensions.get('screen').width,
      backgroundColor: currentTheme.primary,
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    formCard: {
      backgroundColor: currentTheme.background,
      minHeight: Dimensions.get('screen').height * 0.8 - statusBarHeight,
      minWidth: Dimensions.get('screen').width,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    hedaing: {
      color: currentTheme.text,
      fontSize: 30,
      fontWeight: '800',
      alignSelf: 'flex-start',
      marginBottom: 50,
      marginLeft: 50,
    },
    formTextCardView: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minWidth: 350,
    },
    cardHeading: {
      color: currentTheme.primary,
      fontSize: 20,
      fontWeight: '800',
    },
    subCardHeading: {
      color: currentTheme.textLight,
      marginTop: 5,
    },
    formCardInputView: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 50,
      minWidth: 350,
    },
    inputHeading: {
      color: currentTheme.textLight,
      marginBottom: 10,
      marginLeft: 10,
      marginTop: 10,
      alignSelf: 'flex-start',
    },
    input: {
      backgroundColor: currentTheme.textLightXl,
      borderRadius: 20,
      minWidth: 350,
      maxWidth: 350,
      paddingLeft: 20,
      color: currentTheme.primary,
    },
    passwordView: {
      display: 'flex',
      flexDirection: 'row',
    },
    passwordInput: {
      color: currentTheme.primary,
      flexGrow: 1,
    },
    inputIcon: {
      alignSelf: 'center',
      marginLeft: 'auto',
      paddingRight: 10,
    },

    footerText: {
      color: currentTheme.textLight,
      textAlign: 'center',
      marginTop: 'auto',
      marginBottom: 15,
    },
  });
  return styles;
};
export default SignUp;
