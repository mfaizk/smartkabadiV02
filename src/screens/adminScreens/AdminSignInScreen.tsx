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
  Linking,
  // ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import {adminSignIn} from '../../utils/firebaseHandler';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux/store/store';
import AnimatedButton from '../component/AnimatedButton';
import {themeState} from '../../redux/reducer/ThemeReducer';

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const AdminSignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isObsecure, setisObsecure] = useState(true);
  const nav = useNavigation();
  const loadingState = useSelector((state: RootState) => state.loading);
  const currentTheme = useSelector((state: RootState) => state.theme);
  const submitHandler = (): void => {
    if (email && password) {
      adminSignIn(nav, email, password);
      setEmail('');
      setPassword('');
    }
  };
  const styles = useMemo(() => createStyles(currentTheme), [currentTheme]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.hedaing}>Admin Sign in</Text>
          <View style={styles.formCard}>
            <View style={styles.formTextCardView}>
              <Text style={styles.cardHeading}>Welcome Back</Text>
              <Text style={styles.subCardHeading}>
                Hello there, sign to continue
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
              <TouchableOpacity
                disabled={loadingState.loading}
                onPress={() => {
                  if (email && password) {
                    submitHandler();
                  }
                }}>
                <AnimatedButton
                  currentTheme={currentTheme}
                  buttonText={'Signin'}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              Don't have an account?
              <Text
                style={{color: currentTheme.primary}}
                onPress={() => {
                  Linking.openURL('https://forms.gle/tKvtWwsRhZtLLr6r8');
                }}>
                {' '}
                Request Access
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const createStyles = (currentTheme: themeState) => {
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
      marginLeft: 30,
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
      color: currentTheme.textLight,
    },
    passwordView: {
      display: 'flex',
      flexDirection: 'row',
    },
    passwordInput: {
      color: currentTheme.textLight,
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
export default AdminSignInScreen;
