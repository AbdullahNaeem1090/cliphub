import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  currUser: null
}
// user:
//currUser:
// createdAt:"2024-08-13T06:41:56.122Z"
// email:"case1@test.com"
//updatedAt :"2024-08-13T06:42:20.719Z"
// username : "case1"
// __v : 0
// _id:"66bb0034ddc6886bdba98888"
export const currUser = createSlice({
  name: 'userSlicer',
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.currUser = action.payload
      console.log("slice", action)
    },
    clearCurrUser: (state) => {
      state.currUser = null
    }

  },
})


export const { setCurrentUser, clearCurrentUser } = currUser.actions

export default currUser.reducer