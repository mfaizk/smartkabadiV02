import auth from '@react-native-firebase/auth';
import {store} from '../redux/store/store';
import {updateAuthState} from '../redux/reducer/AuthReducer';
import Snackbar from 'react-native-snackbar';
import {StackActions} from '@react-navigation/native';
import {flipState} from '../redux/reducer/LoadingReducer';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {defaultHome, homeValue} from './constValues';
const {dispatch} = store;

export function signUpWithEmailAndPassword(
  email: string,
  password: string,
  navigation: any,
): void {
  dispatch(flipState());
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(e => {
      dispatch(updateAuthState({user: e.user}));
      Snackbar.show({
        text: `Welcome ${e.user.email}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'green',
      });
      AsyncStorage.setItem(defaultHome, homeValue.HOME);
      navigation.dispatch(StackActions.popToTop());
      navigation.replace('home');
      dispatch(flipState());
    })
    .catch(e => {
      dispatch(updateAuthState({user: null}));
      AsyncStorage.setItem(defaultHome, homeValue.WELCOME);

      Snackbar.show({
        text: e.message || 'Error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
      dispatch(flipState());
    });
}

export function signInWithEmailAndPassword(
  email: string,
  password: string,
  navigation: any,
): void {
  dispatch(flipState());

  auth()
    .signInWithEmailAndPassword(email, password)
    .then(e => {
      dispatch(updateAuthState({user: e.user}));
      AsyncStorage.setItem(defaultHome, homeValue.HOME);
      Snackbar.show({
        text: `Welcome ${e.user.email}`,
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'green',
      });
      dispatch(flipState());
      navigation.dispatch(StackActions.popToTop());
      navigation.replace('home');
    })
    .catch(e => {
      AsyncStorage.setItem(defaultHome, homeValue.WELCOME);

      dispatch(updateAuthState({user: null}));
      console.log(e.message);

      Snackbar.show({
        text: e.message || 'Error occured',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
      dispatch(flipState());
    });
}

export function signOut(navigation: any, autoLogout: boolean = false) {
  auth()
    .signOut()
    .then(() => {
      AsyncStorage.setItem(defaultHome, homeValue.WELCOME);

      dispatch(updateAuthState({user: null}));
      if (!autoLogout) {
        Snackbar.show({
          text: 'SignOut successfull',
          duration: Snackbar.LENGTH_SHORT,
          textColor: 'white',
          backgroundColor: 'green',
        });
      }

      navigation.dispatch(StackActions.popToTop());
      navigation.replace('welcome');
    })
    .catch(() => {
      Snackbar.show({
        text: 'Unable to Signout',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
}

//Admin-Function Start-here

export function adminSignIn(nav: any, email: string, password: string): void {
  // let user: FirebaseAuthTypes.UserCredential;
  dispatch(flipState());
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      firestore()
        .collection('admin-emails')
        .where('email', '==', user.user.email)
        .get()
        .then(data => {
          if (data.docs.length > 0) {
            AsyncStorage.setItem(defaultHome, homeValue.ADMINHOME);

            dispatch(updateAuthState({user: user.user}));
            dispatch(flipState());
            Snackbar.show({
              text: `Welcome ${user.user.email}`,
              duration: Snackbar.LENGTH_SHORT,
              textColor: 'white',
              backgroundColor: 'green',
            });
            nav.dispatch(StackActions.popToTop());
            nav.replace('admin-home');
          } else {
            AsyncStorage.setItem(defaultHome, homeValue.HOME);

            dispatch(flipState());
            signOut(nav, true);
            Snackbar.show({
              text: 'You are not admin',
              duration: Snackbar.LENGTH_SHORT,
              textColor: 'white',
              backgroundColor: 'red',
            });
          }
        })
        .catch(e => {
          AsyncStorage.setItem(defaultHome, homeValue.WELCOME);

          Snackbar.show({
            text: e.message || 'unable to login',
            duration: Snackbar.LENGTH_SHORT,
            textColor: 'white',
            backgroundColor: 'green',
          });
          dispatch(flipState());
        });
    })
    .catch(e => {
      dispatch(flipState());
      Snackbar.show({
        text: e.message || 'unable to login',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'red',
      });
    });
}

//Admin-Function End-here
