import { configureStore } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer, persistStore } from 'redux-persist';

import { productsApi } from '../api/productsApi';
import cartReducer from './cartSlice';
import authReducer from './authSlice';

const cartPersistConfig = {
  key: 'cart',
  storage: AsyncStorage,
};

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(productsApi.middleware),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
