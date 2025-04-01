import { createSlice } from "@reduxjs/toolkit";

const initialState={
    channel:[]
}

 const channelSlice=createSlice({
    name:"channelSlicer",
    initialState,
    reducers:{
        setChannel:(state,action)=>{
            state.channel=action.payload
        }
    }
})

 export const {setChannel}=channelSlice.actions
export default channelSlice.reducer
 
