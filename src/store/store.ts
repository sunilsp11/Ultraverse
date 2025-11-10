import AsyncStorage from '@react-native-async-storage/async-storage';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { AnyAction, combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { ThunkDispatch } from 'redux-thunk';
import backendBaseApi from '../services/backendBaseApi';
import { authApi } from '../services/authRequest/authApi';
import categoriesReducer from './slices/categoriesSlice';
import profileReducer from './slices/profileSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  blacklist: [
    backendBaseApi.reducerPath,
    authApi.reducerPath,
  ],
};

const rootReducer = combineReducers({
  [backendBaseApi.reducerPath]: backendBaseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  categories: categoriesReducer,
  profile: profileReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      warnAfter: 100,
    }).concat(
      backendBaseApi.middleware,
      authApi.middleware,
    ),
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkDispatch = ThunkDispatch<RootState, never, AnyAction>;

type DispatchFunc = () => AppDispatch;
setupListeners(store.dispatch);
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { persistor, store };
