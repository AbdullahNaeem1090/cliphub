import { createSlice } from "@reduxjs/toolkit";


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
} = currentVideoSlice.actions;

export default currentVideoSlice.reducer;
