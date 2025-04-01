import { configureStore } from '@reduxjs/toolkit'
import sessionStorage from 'redux-persist/es/storage/session'; 
import {persistReducer, persistStore} from "redux-persist"
import { combineReducers } from '@reduxjs/toolkit'
import userReducer from '../slices/currentUser'
import myVideoReducer from '../slices/myVideoSlice'
import playlistReducer from '../slices/playlistSlice';
import currentVideoReducer from '../slices/currentVideoSlice';
import allVideosReducer from '../slices/allVideosSlice';
import likeReducer from '../slices/likeSlice';
import subscribeReducer  from '../slices/subscriptionSlice';
import playistVideoReducer from '../slices/playistVideosSlice';
import channelReducer from '../slices/followedChannel';
import watchHistoryReducer from '../slices/watchHistorySlice';

const persistConfig={
  key:"root",
  version:1,
  storage:sessionStorage
}

const rootReducer=combineReducers({
  user:userReducer,
  myVideos:myVideoReducer,
  playlist:playlistReducer,
  currentVideo:currentVideoReducer,
  allVideos:allVideosReducer,
  likes:likeReducer,
  subscribe:subscribeReducer,
  plVideos:playistVideoReducer,
  followedTo:channelReducer,
  history:watchHistoryReducer

})

const persistReducerFn=persistReducer(persistConfig,rootReducer)

export const store = configureStore({
   reducer:persistReducerFn
})

export const persistor = persistStore(store);
export default store