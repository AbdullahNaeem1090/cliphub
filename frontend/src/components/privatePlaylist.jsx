// import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentVideo,addToWatchHistory } from "../slices/currentVideoSlice"
import { useNavigate } from "react-router-dom"
import { setPlaylistVideos } from "../slices/playistVideosSlice"
import { deletePlaylist } from "../slices/playlistSlice"

import axios from "axios"

function PrivatePlaylist() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const playlists = useSelector(state => state.playlist.privatePlaylists)
    console.log("private:",playlists)

    async function navigateToVideoPage(index) {
        let videoId = playlists[index].videos[0]
        try {
            console.log("po")
            let resp = await axios.get(`/api/video/playVideo/${videoId}`)
            let resp1 = await axios.get(`/api/playlist/playlistVideos/${playlists[index]._id}`)
            console.log("do")
            dispatch(setCurrentVideo(resp.data.data))
            dispatch(addToWatchHistory(videoId))
            dispatch(setPlaylistVideos(resp1.data.data))
            navigate("../playlist")
        } catch (error) {
            console.log(error)
        }
    }

    async function DeletePlaylist(id) {
        try {
            let resp=await axios.delete(`/api/playlist/deletePlaylist/${id}`)
            console.log(resp)
            if(resp){
                console.log("dne")
              dispatch(deletePlaylist({id:id,category:"private"}))
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (playlists.length < 1) {
        return <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
            <div className="p-3 rounded-lg mt-14 overflow-clip">
            <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56">No Playlists Yet</p>

            </div>
        </div>
    }

    return <>
        <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
            <div className="p-3 rounded-lg mt-14 overflow-clip">

                <p className="text-white font-serif text-5xl border-b inline-block pb-2 mb-2">Your Playlists</p>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 space-x-4" >
                    {playlists?.map((playlist, index) => (
                        <div className="max-w-sm border rounded-lg shadow bg-white bg-opacity-5 hover:bg-opacity-10 border-gray-700 my-2" key={index}  >

                            <img className="rounded-t-md h-56 w-full object-cover" src="/src/assets/defplaylist.png" alt="pic" />

                            <div className="flex justify-between p-3">
                                <div className="">

                                    <h5 className="mb-1 text-2xl font-bold text-white">{playlist?.title}</h5>

                                    <p className="mb-2 font-normal text-gray-300 dark:text-gray-400">Videos:{playlist?.videos.length}</p>
                                    <button className="inline-flex items-center px-3 py-1 text-lg font-bold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 cursor-pointer" onClick={() => navigateToVideoPage(index)}>
                                        Watch
                                    </button>
                                </div>
                                <img src="/src/assets/delete.png" className="h-7 w-8 cursor-pointer" alt="delete" onClick={() => DeletePlaylist(playlist._id)} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

    </>
}

export default PrivatePlaylist