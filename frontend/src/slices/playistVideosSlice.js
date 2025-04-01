import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    playlistVideos: []
}

export const playlistVideosSlice=createSlice({
    name:"plVideoSlicer",
    initialState,
    reducers:{
        setPlaylistVideos:(state,action)=>{
            state.playlistVideos=action.payload[0].playlistVideos
        },
        updateRemoval:(state,action)=>{
            state.playlistVideos=state.playlistVideos.filter((obj)=>obj._id!==action.payload)
        },
        updateAddition:(state,action)=>{
            state.playlistVideos.push(action.payload)
        }

    }
})

export const { setPlaylistVideos,updateRemoval,updateAddition} = playlistVideosSlice.actions

export default playlistVideosSlice.reducer