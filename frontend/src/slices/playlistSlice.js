import { createSlice } from '@reduxjs/toolkit'
const initialState = {
    myplaylists: [],
    privatePlaylists: [
        // {
        //     category: "public"
        //     owner: "66c61e0d7e6689b57a2546e4"
        //     title: "hello"
        //     videos: ['66c5e4aa2599bcb20c65c5e7']
        //     __v: 0
        //     _id: "66c6f6f883577e7855b1514a"
        // }
    ]
}



export const playlistSlice = createSlice({
    name: 'playlistSlice',
    initialState,
    reducers: {
        initializePlaylist: (state, action) => {
            console.log(action.payload)
            state.myplaylists = action.payload.myPlaylists
            state.privatePlaylists = action.payload.privatePlaylists
            console.log(state.myplaylists)
        },
        setPlaylist: (state, action) => {
            if (action.payload.category == "public") {
                state.myplaylists.push(action.payload);
            } else {
                state.privatePlaylists.push(action.payload);
            }
        },
        addToPlaylist: (state, action) => {
            if (action.payload.category === "public") {
                state.myplaylists[action.payload.index].videos.push(action.payload.videoIdPlaylist)
            } else {
                state.privatePlaylists[action.payload.index].videos.push(action.payload.videoIdPlaylist)
            }
        },
        remVideoFromPlaylist: (state, action) => {
            if (action.payload.category == "private") {
                state.privatePlaylists = state.privatePlaylists.map((playlist) =>
                ({
                    ...playlist,
                    videos: playlist.videos.filter((id) => (id !== action.payload.videoId))
                }))
            } else if (action.payload.category == "both") {
                console.log("id:",action.payload.videoId)
                state.privatePlaylists = state.privatePlaylists.map((playlist) =>
                ({
                    ...playlist,
                    videos: playlist.videos.filter((id) => (id !== action.payload.videoId))
                }))
                state.myplaylists =state.myplaylists.map((playlist) =>
                ({
                    ...playlist,
                    videos: playlist.videos.filter((id) => (id !== action.payload.videoId))
                }))
            }
        },
        deletePlaylist: (state, action) => {
            if(action.payload.category=="private"){
                state.privatePlaylists = state.privatePlaylists.filter((obj) => obj._id !== action.payload.id)
            }else{
                state.myplaylists = state.myplaylists.filter((obj) => obj._id !== action.payload.id)
            }
        }
    }
})

export const { setPlaylist, initializePlaylist, addToPlaylist, remVideoFromPlaylist, deletePlaylist } = playlistSlice.actions

export default playlistSlice.reducer