import { createSlice,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';

export const addToWatchHistory = createAsyncThunk(
    'currentVideo/addToWatchHistory',
    async (videoId) => {
      const response = await axios.patch(`/api/user/addToWatchHistory/${videoId}`);
      
      console.log(response);
      return response.data; 
    }
  );

const initialState = {
    currentVideo: [
        {
            subscribersCount: 0,
            likes_count: 0,
            comments: [],
            reply_array: [],
            ownerDetails: [],
            title: "",
            videoURL: "",
            _id: "",
            playListMember: []
        }
    ]
}


export const currentVideoSlice = createSlice({
    name: 'currentVideoSlicer',
    initialState,
    reducers: {
        setCurrentVideo: (state, action) => {
            state.currentVideo.push(action.payload[0])
            state.currentVideo.shift()
            addToWatchHistory()
        },
        addTempComment: (state, action) => {
            console.log(action.payload)
            state.currentVideo[0].reply_array.push({ replies: [] })
            state.currentVideo[0].comments.push(action.payload)
        },
        remTempComment: (state, action) => {
            state.currentVideo[0].comments.splice(action.payload, 1)
        },
        addTempReply: (state, action) => {
            state.currentVideo[0].reply_array[action.payload.index].replies.push(action.payload.replyObj)
        },
        remTempReply: (state, action) => {
            state.currentVideo[0].reply_array.splice(action.payload, 1)
        },
        manageTempSubscriber: (state, action) => {
            if (action.payload === 1) {
                state.currentVideo[0].subscribersCount++
            } else {
                state.currentVideo[0].subscribersCount--
            }
        },
        manageTempLikes: (state, action) => {
            if (action.payload === 1) {
                state.currentVideo[0].likes_count++
            } else {
                state.currentVideo[0].likes_count--
            }
        },
        addTempPlaylistId: (state, action) => {
            console.log(state.currentVideo[0], "before")
            state.currentVideo[0].playListMember.push(action.payload)
        },
        memberRemoval: (state, action) => {
            state.currentVideo = [
                {
                    ...state.currentVideo[0],
                    playListMember: state.currentVideo[0].playListMember.filter((id) => (action.payload !== id))
                }
            ]
        }
    },
})


export const { setCurrentVideo, addTempComment, addTempReply, manageTempSubscriber, remTempComment, remTempReply, manageTempLikes, addTempPlaylistId, memberRemoval } = currentVideoSlice.actions

export default currentVideoSlice.reducer
