import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../reducer/AuthReducer';
import loadingslice from '../reducer/LoadingReducer';
import themeSlice from '../reducer/ThemeReducer';
import AdminDataListSlice from '../reducer/AdminDataListReducer';
export const store = configureStore({
  reducer: {
    auth: authSlice,
    loading: loadingslice,
    theme: themeSlice,
    adminDataList: AdminDataListSlice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({serializableCheck: false});
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
