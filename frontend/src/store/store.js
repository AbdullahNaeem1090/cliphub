import { configureStore } from '@reduxjs/toolkit'
import sessionStorage from 'redux-persist/es/storage/session'; 
import {persistReducer, persistStore} from "redux-persist"
import { combineReducers } from '@reduxjs/toolkit'
import playlistReducer from '../slices/playlistSlice';
import currentVideoReducer from '../slices/currentVideoSlice';
import  toastReducer  from '../slices/toastSlice';
import  videoUploadReducer  from '../slices/videoUploadSlice';

const persistConfig={
  key:"root",
  version:1,
  storage:sessionStorage,
  blacklist: ["toastReducer","videoUploadReducer"]
}

const rootReducer=combineReducers({
  playlist:playlistReducer,
  currentVideo:currentVideoReducer,
  toast:toastReducer,
  videoUpload:videoUploadReducer

})

const persistReducerFn=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
   reducer:persistReducerFn
})

export const persistor = persistStore(store);
export default store