import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    myVideoList:{
      videoList:[]
    }
  }

  export const myVideoSlice = createSlice({
    name: 'myVideoSlicer',
    initialState,
    reducers: {
      setMyVideos: (state, action) => {
        state.myVideoList = action.payload[0]
        console.log("=>",state.myVideoList)
      },
      addVideoToArray: (state, action) => {
        state.myVideoList.videoList.push(action.payload);
        console.log("Video added:", action.payload);
      },
      setTempVideoArray:(state,action)=>{
        state.myVideoList.videoList=action.payload
        console.log(state)
      }
  
    },
  })
  
  export const { setMyVideos,addVideoToArray,setTempVideoArray } = myVideoSlice.actions
  
  export default myVideoSlice.reducer