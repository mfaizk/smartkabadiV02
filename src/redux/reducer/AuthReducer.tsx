import {PayloadAction, createSlice} from '@reduxjs/toolkit';
// import * as firebase from '@react-native-firebase/app';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
export interface authState {
  user: FirebaseAuthTypes.User | null;
}

const initialState: authState = {
  user: auth().currentUser,
};

export const authSlice = createSlice({
  name: 'authState',
  initialState,
  reducers: {
    updateAuthState: (state, action: PayloadAction<authState>) => {
      const {user} = action.payload;
      console.log(user);

      state.user = user;
    },
  },
});

export const {updateAuthState} = authSlice.actions;
export default authSlice.reducer;
