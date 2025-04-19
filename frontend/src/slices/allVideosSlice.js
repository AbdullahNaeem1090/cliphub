import { createSlice } from '@reduxjs/toolkit'
``
const initialState = {
    gatheredVideos: [{
        _id: "",
        title: "",
        thumbnail: "",
        avatar: "",
        username: ""
    }]
}

export const allVideosSlice = createSlice({
    name: "allvideoSlicer",
    initialState,
    reducers: {
        setAllVideos: (state, action) => {
            state.gatheredVideos = action.payload
        },
        newComerVideo: (state, action) => {
            state.gatheredVideos.unshift(action.payload)
        },
        removeVideoFromHomePage:(state,action)=>{
            console.log(action.payload)
            state.gatheredVideos=state.gatheredVideos.filter(video=>video._id!=action.payload )
        }

    }
})

export const { setAllVideos, newComerVideo ,removeVideoFromHomePage} = allVideosSlice.actions

export default allVideosSlice.reducer