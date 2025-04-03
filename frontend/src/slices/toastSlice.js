import { createSlice } from '@reduxjs/toolkit'

const initialState = {
   isVisible:false,
   content:""
}

export const toastSlice = createSlice({
    name: "toastSlice",
    initialState,
    reducers: {
        showToast: (state, action) => {
            state.isVisible=true
            state.content=action.payload
        },
        hideToast: (state, ) => {
            state.isVisible=false
            state.content=""
        }
    }
})

export const { showToast,hideToast } = toastSlice.actions

export default toastSlice.reducer