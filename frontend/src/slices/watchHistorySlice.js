import { createSlice } from "@reduxjs/toolkit";

const initialState={
    historyVideos:[]
}

const watchHistorySlice=createSlice({
    name:"wathchistoryslice",
    initialState,
    reducers:{
        setWatchHistory:(state,action)=>{
        state.historyVideos=action.payload
        },
        removeVideoFromHistory:(state,action)=>{
          state.historyVideos=state.historyVideos.filter(video=>video._id!=action.payload)
        },
        clearWatchHistory:(state,_)=>{
            state.historyVideos=[]
        }
    }
})
export const {setWatchHistory,removeVideoFromHistory,clearWatchHistory}=watchHistorySlice.actions
export default watchHistorySlice.reducer