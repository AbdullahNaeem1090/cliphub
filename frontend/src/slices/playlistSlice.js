import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  _private: [],
  _public: [],
  _hidden: [],
};

export const playlistSlice = createSlice({
  name: "playlistSlice",
  initialState,
  reducers: {
    setPlaylistData: (state, action) => {
      return action.payload;
    },
    _createPlaylist: (state, action) => {
      let category = `_${action.payload.category}`;
      state[category].push(action.payload);
    },
    addVideoToPlaylist: (state, action) => {
      const { category, pList_Id, videoId } = action.payload;
      let _category = `_${category}`;
      state[_category].forEach((playlist) => {
        if (playlist._id === pList_Id) {
          playlist.videos.push(videoId);
        }
      });
    },
    remVideofromPlaylist: (state, action) => {
      const { category, pList_Id, videoId } = action.payload;
      let _category = `_${category}`;
      state[_category].forEach((playlist) => {
        if (playlist._id === pList_Id) {
          playlist.videos = playlist.videos.filter(
            (video) => video !== videoId
          );
        }
      });
    },

    deletePlaylist: (state, action) => {
      if (action.payload.category == "private") {
        state.privatePlaylists = state.privatePlaylists.filter(
          (obj) => obj._id !== action.payload.id
        );
      } else {
        state.myplaylists = state.myplaylists.filter(
          (obj) => obj._id !== action.payload.id
        );
      }
    },
  },
});

export const {
  _createPlaylist,
  addVideoToPlaylist,
  remVideofromPlaylist,
  setPlaylistData,
  deletePlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;
