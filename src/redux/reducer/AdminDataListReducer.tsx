import {PayloadAction, createSlice} from '@reduxjs/toolkit';
export interface productData {
  address: string;
  category: string;
  description: string;
  imageURL: string;
  latitude: string;
  longitude: string;
  product_name: string;
}
const initialState: productData = {
  address: '',
  category: '',
  description: '',
  imageURL: '',
  latitude: '',
  longitude: '',
  product_name: '',
};

const AdminDataListSlice = createSlice({
  name: 'adminDataList',
  initialState: [initialState],
  reducers: {
    initialDataEntry: (state, action: PayloadAction<productData[]>) => {
      state.length = 0;
      state.push(...action.payload);
      // console.log(state);
    },
  },
});

export const {initialDataEntry} = AdminDataListSlice.actions;
export default AdminDataListSlice.reducer;
