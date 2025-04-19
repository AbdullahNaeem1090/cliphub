// // import { useState } from "react"
// import { useDispatch, useSelector } from "react-redux"
// import { setCurrentVideo,addToWatchHistory } from "../slices/currentVideoSlice"
// import { useNavigate } from "react-router-dom"
// import { setPlaylistVideos } from "../slices/playistVideosSlice"
// import { deletePlaylist } from "../slices/playlistSlice"

// import axios from "axios"

// function PrivatePlaylist() {

//     const navigate = useNavigate()
//     const dispatch = useDispatch()
//     const playlists = useSelector(state => state.playlist.privatePlaylists)
//     console.log("private:",playlists)

//     async function navigateToVideoPage(index) {
//         let videoId = playlists[index].videos[0]
//         try {
//             console.log("po")
//             let resp = await axios.get(`/api/video/playVideo/${videoId}`)
//             let resp1 = await axios.get(`/api/playlist/playlistVideos/${playlists[index]._id}`)
//             console.log("do")
//             dispatch(setCurrentVideo(resp.data.data))
//             dispatch(addToWatchHistory(videoId))
//             dispatch(setPlaylistVideos(resp1.data.data))
//             navigate("../playlist")
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     async function DeletePlaylist(id) {
//         try {
//             let resp=await axios.delete(`/api/playlist/deletePlaylist/${id}`)
//             console.log(resp)
//             if(resp){
//                 console.log("dne")
//               dispatch(deletePlaylist({id:id,category:"private"}))
//             }
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     if (playlists.length < 1) {
//         return <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
//             <div className="p-3 rounded-lg mt-14 overflow-clip">
//             <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56">No Playlists Yet</p>

//             </div>
//         </div>
//     }

//     return <>
//         <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
//             <div className="p-3 rounded-lg mt-14 overflow-clip">

//                 <p className="text-white font-serif text-5xl border-b inline-block pb-2 mb-2">Your Playlists</p>

                
//             </div>
//         </div>

//     </>
// }

// export default PrivatePlaylist