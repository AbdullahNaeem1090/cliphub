import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    subscribedChannels: []
}

export const subscribeSlice=createSlice({
    name:"subscribeSlicer",
    initialState,
    reducers:{
        setSubscribedChannels:(state,action)=>{
            state.subscribedChannels=action.payload
        },
        addSubscribedChannel:(state,action)=>{
            state.subscribedChannels.push(action.payload)
        },
        removeSubscribedChannel:(state,action)=>{
            state.subscribedChannels=state.subscribedChannels.filter((obj)=>obj.ContentCreators[0]._id!==action.payload)
        }
    }
})

export const { setSubscribedChannels ,addSubscribedChannel,removeSubscribedChannel} = subscribeSlice.actions

export default subscribeSlice.reducer