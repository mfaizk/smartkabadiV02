import {createSlice} from '@reduxjs/toolkit';
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
    initialDataEntry: state => {},
  },
});

export const {initialDataEntry} = AdminDataListSlice.actions;
export default AdminDataListSlice.reducer;
