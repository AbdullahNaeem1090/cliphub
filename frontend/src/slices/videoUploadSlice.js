import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   showUploadProgressBar:false,
}

export const videoUploadSlice = createSlice({
    name: "toastSlice",
    initialState,
    reducers: {
        showProgress: (state,) => {
            state.showUploadProgressBar=true
        },
        finishProgress: (state, ) => {
            state.showUploadProgressBar=false
        }
    }
})

export const { showProgress,finishProgress } = videoUploadSlice.actions

export default videoUploadSlice.reducer