import auth from '@react-native-firebase/auth';
import {store} from '../redux/store/store';
import {updateAuthState} from '../redux/reducer/AuthReducer';
import Snackbar from 'react-native-snackbar';
import {StackActions} from '@react-navigation/native';
import {flipState} from '../redux/reducer/LoadingReducer';
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

      navigation.dispatch(StackActions.popToTop());
      navigation.navigate('home');
      dispatch(flipState());
    })
    .catch(e => {
      dispatch(updateAuthState({user: null}));

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

export function signOut(navigation: any): void {
  auth()
    .signOut()
    .then(() => {
      dispatch(updateAuthState({user: null}));
      Snackbar.show({
        text: 'SignOut successfull',
        duration: Snackbar.LENGTH_SHORT,
        textColor: 'white',
        backgroundColor: 'green',
      });

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
