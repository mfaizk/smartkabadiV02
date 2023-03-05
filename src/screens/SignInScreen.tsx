import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
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
} from 'react-native';
import {themeDataDark1, themeDataLight1} from '../configs/themeData';

const currentTheme = themeDataDark1 || themeDataLight1;
const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight : 0;

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigation();
  const submitHandler = (): void => {
    console.log(email);
    console.log(password);
  };

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.body}>
          <Text style={styles.hedaing}>Sign in</Text>
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
              />
              <Text style={styles.inputHeading}>Password</Text>
              <TextInput
                style={styles.input}
                value={password.trim()}
                onChangeText={e => setPassword(e.trim())}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (email && password) {
                    submitHandler();
                  }
                }}>
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.footerText}>
              Don't have an accoun?
              <Text style={{color: currentTheme.primary}}>Sign up</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
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
    paddingLeft: 20,
    color: currentTheme.primary,
  },
  button: {
    backgroundColor: currentTheme.primary,
    padding: 15,
    borderRadius: 25,
    marginTop: 30,
    minWidth: 350,
  },
  buttonText: {
    color: currentTheme.text,
    textAlign: 'center',
    fontSize: 15,
  },
  footerText: {
    color: currentTheme.textLight,
    textAlign: 'center',
    marginTop: 'auto',
    marginBottom: 15,
  },
});

export default SignIn;
