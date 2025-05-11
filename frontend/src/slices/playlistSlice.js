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
    renamePlaylist: (state, action) => {
      const { playlistId, newName, category } = action.payload;
      let _category = `_${category}`;
      state[_category].forEach((playlist) => {
        if (playlist._id === playlistId) {
          playlist.title = newName;
        }
      });
    },
changeCategory: (state, action) => {
  const { playlistId, oldCategory, newCategory } = action.payload;
  const old_category = `_${oldCategory}`;
  const new_category = `_${newCategory}`;

  const playlist = state[old_category].find(p => p._id === playlistId);
  if (!playlist) return;
  playlist.category = newCategory;

  state[old_category] = state[old_category].filter(p => p._id !== playlistId);

  state[new_category].push(playlist);
}

  },
});

export const {
  _createPlaylist,
  addVideoToPlaylist,
  remVideofromPlaylist,
  setPlaylistData,
  deletePlaylist,
  renamePlaylist,
  changeCategory,
} = playlistSlice.actions;

export default playlistSlice.reducer;
