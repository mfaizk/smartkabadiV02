import {createSlice} from '@reduxjs/toolkit';

export interface LoadingState {
  loading: boolean;
}
const initialState = {
  loading: false,
};

export const loadingslice = createSlice({
  name: 'loadingState',
  initialState,
  reducers: {
    flipState: state => {
      state.loading = !state.loading;
    },
  },
});

export const {flipState} = loadingslice.actions;
export default loadingslice.reducer;
