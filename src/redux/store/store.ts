import {configureStore} from '@reduxjs/toolkit';
import authSlice from '../reducer/AuthReducer';
import loadingslice from '../reducer/LoadingReducer';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    loading: loadingslice,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware({serializableCheck: false});
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
