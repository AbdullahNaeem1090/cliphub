import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const addToWatchHistory = createAsyncThunk(
  "currentVideo/addToWatchHistory",
  async (videoId) => {
    const response = await axios.patch(
      `/api/user/addToWatchHistory/${videoId}`
    );

    console.log(response);
    return response.data;
  }
);

const initialState = {
  _id: "",
  title: "",
  description: "",
  videoURL: "",
  createdAt: "",
  VideoCreator: {
    username: "",
    avatar: "",
    _id: "",
  },
  likesCount: 0,
  isLikedByCurrentUser: false,
  hasSubscribed: false,
  subscribersCount: 0,
  Comments: [],
  playListInfo: [],
};
//   {
//     "_id": "67efd05420f35a9757e3d242",
//     "owner": "67ee53f86407375ef00a6de7",
//     "title": "check",
//     "videos": [
//         "66d1b393ffb0050cbb964550"
//     ],
//     "category": "private",
//     "__v": 0
// }

export const currentVideoSlice = createSlice({
  name: "currentVideoSlicer",
  initialState,
  reducers: {
    setCurrentVideo: (_, action) => {
      return action.payload;
    },
    createNewPlaylist: (state, action) => {
      return {
        ...state,
        playListInfo: [...state.playListInfo, action.payload],
      };
    },
    addVideoInPlaylist: (state, action) => {
      const { pList_Id, videoId } = action.payload;
      const playlist = state.playListInfo.find(
        (playlist) => playlist._id === pList_Id
      );
      if (playlist && !playlist.videos.includes(videoId)) {
        playlist.videos.push(videoId);
      }
    },

    removeVideofromPlaylist: (state, action) => {
      const { pList_Id, videoId } = action.payload;

      const playlist = state.playListInfo.find(
        (playlist) => playlist._id === pList_Id
      );
      if (playlist) {
        playlist.videos = playlist.videos.filter((vidId) => vidId !== videoId);
      }
    },
    addLike: (state) => {
      state.likesCount++;
      state.isLikedByCurrentUser = true;
    },
    removeLike: (state) => {
      state.likesCount--;
      state.isLikedByCurrentUser = false;
    },
    addSubscribe: (state) => {
      state.hasSubscribed = true;
      state.subscribersCount++;
    },
    unSubscribe_slice: (state) => {
      state.hasSubscribed = false;
      state.subscribersCount--;
    },
    addComment: (state, action) => {
      state.Comments.unshift(action.payload);
    },
    remComment: (state, action) => {
      state.Comments = state.Comments.filter(
        (comment) => comment._id !== action.payload.commentId
      );
    },
    addReplies:(state,action)=>{
      state.Comments=state.Comments.map((comment)=>{
        if(comment._id===action.payload.commentId){
          comment.replies=action.payload.replies
        }
        return comment
      })
    },
    addReply:(state,action)=>{
      state.Comments=state.Comments.map((comment)=>{
        if(comment._id===action.payload.commentId){
          comment.replies ? 
          comment.replies.unshift(action.payload.reply) :
          comment.replies=[action.payload.reply]
        }
        return comment
      })
    },
    removeReply:(state,action)=>{
      state.Comments=state.Comments.map((comment)=>{
        if(comment._id===action.payload.commentId){
          comment.replies=comment.replies.filter((reply)=>reply._id!==action.payload.replyId) 
        }
        return comment
      })
    },
    addTempComment: (state, action) => {
      state.Comments.unshift(action.payload);
    },
    remTempComment: (state, action) => {
      state.currentVideo[0].comments.splice(action.payload, 1);
    },
    addTempReply: (state, action) => {
      state.currentVideo[0].reply_array[action.payload.index].replies.push(
        action.payload.replyObj
      );
    },
    remTempReply: (state, action) => {
      state.currentVideo[0].reply_array.splice(action.payload, 1);
    },
    manageTempSubscriber: (state, action) => {
      if (action.payload === 1) {
        state.currentVideo[0].subscribersCount++;
      } else {
        state.currentVideo[0].subscribersCount--;
      }
    },
    manageTempLikes: (state, action) => {
      if (action.payload === 1) {
        state.currentVideo[0].likes_count++;
      } else {
        state.currentVideo[0].likes_count--;
      }
    },
    addTempPlaylistId: (state, action) => {
      console.log(state.currentVideo[0], "before");
      state.currentVideo[0].playListMember.push(action.payload);
    },
    memberRemoval: (state, action) => {
      state.currentVideo = [
        {
          ...state.currentVideo[0],
          playListMember: state.currentVideo[0].playListMember.filter(
            (id) => action.payload !== id
          ),
        },
      ];
    },
  },
});

export const {
  setCurrentVideo,
  addLike,
  removeLike,
  createNewPlaylist,
  addVideoInPlaylist,
  removeVideofromPlaylist,
  addSubscribe,
  unSubscribe_slice,
  addComment,
  remComment,
  addReply,
  addReplies,
  removeReply,
  addTempReply,
  manageTempSubscriber,
  remTempComment,
  remTempReply,
  addTempComment,
  manageTempLikes,
  addTempPlaylistId,
  memberRemoval,
} = currentVideoSlice.actions;

export default currentVideoSlice.reducer;
