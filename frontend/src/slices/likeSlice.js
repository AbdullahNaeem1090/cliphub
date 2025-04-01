import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    likedVideos: []
}

const likeSlice=createSlice({
    name:"likeSlicer",
    initialState,
    reducers:{
        setLikedVideos:(state,action)=>{
            state.likedVideos=action.payload
        },
        addlikedVideo:(state,action)=>{
            state.likedVideos.push(action.payload)
        },
        removelikedVideo:(state,action)=>{
            state.likedVideos=state.likedVideos.filter((obj)=>obj.likedVideoId!==action.payload)
        }
    }
})

export const { setLikedVideos ,addlikedVideo,removelikedVideo} = likeSlice.actions

export default likeSlice.reducer