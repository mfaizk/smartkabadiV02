import {PayloadAction, createSlice} from '@reduxjs/toolkit';
export interface productData {
  address: string;
  category: string;
  description: string;
  imageURL: string;
  latitude: string;
  longitude: string;
}
const initialState: productData = {
  address: '',
  category: '',
  description: '',
  imageURL: '',
  latitude: '',
  longitude: '',
};

const AdminDataListSlice = createSlice({
  name: 'adminDataList',
  initialState: [initialState],
  reducers: {
    initialDataEntry: (state, action: PayloadAction<productData>) => {
      state.push(action.payload);
    },
  },
});

export const {initialDataEntry} = AdminDataListSlice.actions;
export default AdminDataListSlice.reducer;
