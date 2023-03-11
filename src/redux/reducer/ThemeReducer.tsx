import AsyncStorage from '@react-native-async-storage/async-storage';
import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {themeStringKey} from '../../utils/constValues';

export interface themePayload {
  themeNumber: number;
}

export interface themeState {
  primary: string;
  secondary: string;
  tertiary: string;
  quaternary: string;
  text: string;
  borderColor: string;
  background: string;
  textLight: string;
  textLightXl: string;
}

const initialState: themeState = {
  primary: '#060047',
  secondary: '#B3005E',
  tertiary: '#E90064',
  quaternary: '#FF5F9E',
  text: '#ffffff',
  borderColor: '#ffffff',
  background: '#ffffff',
  textLight: '#758283',
  textLightXl: '#cce3e6',
};

export const themeSlice = createSlice({
  name: 'themeState',
  initialState,
  reducers: {
    changeTheme: (state, action: PayloadAction<themePayload>) => {
      const {themeNumber} = action.payload;
      switch (themeNumber) {
        case 0:
          AsyncStorage.setItem(themeStringKey, '0');
          state.primary = '#060047';
          state.secondary = '#B3005E';
          state.tertiary = '#E90064';
          state.quaternary = '#FF5F9E';
          state.text = '#ffffff';
          state.borderColor = '#ffffff';
          state.background = '#ffffff';
          state.textLight = '#758283';
          state.textLightXl = '#cce3e6';
          break;
        case 1:
          AsyncStorage.setItem(themeStringKey, '1');
          state.primary = '#EDF1D6';
          state.secondary = '#9DC08B';
          state.tertiary = '#609966';
          state.quaternary = '#40513B';
          state.text = '#111111';
          state.borderColor = '#5A5A5A';
          state.background = '#111111';
          state.textLight = '#758283';
          state.textLightXl = '#cce3e6';
          break;

        default:
          state.primary = '#060047';
          state.secondary = '#B3005E';
          state.tertiary = '#E90064';
          state.quaternary = '#FF5F9E';
          state.text = '#ffffff';
          state.borderColor = '#ffffff';
          state.background = '#ffffff';
          state.textLight = '#758283';
          state.textLightXl = '#cce3e6';
          break;
      }
    },
  },
});

export const {changeTheme} = themeSlice.actions;
export default themeSlice.reducer;
