import { useDispatch, useSelector } from "react-redux"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { addToWatchHistory, setCurrentVideo } from "../slices/currentVideoSlice"
import { setPlaylistVideos } from "../slices/playistVideosSlice"
import { deletePlaylist } from "../slices/playlistSlice"

function MyPlaylist() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const videos = useSelector(state => state.myVideos.myVideoList.videoList)
    const playlists = useSelector(state => state.playlist.myplaylists)
    console.log("muplaylists:", playlists)

    const thumbnail = playlists?.map((item) => (item?.videos[0]))
    console.log("thumb",thumbnail)

    const final = videos?.filter((item, index) => item._id == thumbnail[index])
    console.log("final", final)

    async function navigateToVideoPage(index) {
        let videoId = playlists[index].videos[0]
        try {
            console.log("po")
            let resp = await axios.get(`/api/video/playVideo/${videoId}`)
            let resp1 = await axios.get(`/api/playlist/playlistVideos/${playlists[index]._id}`)
            console.log("do")
            dispatch(setCurrentVideo(resp.data.data))
            dispatch(addToWatchHistory(resp.data.data._id))
            dispatch(setPlaylistVideos(resp1.data.data))
            navigate("../../playlist")
        } catch (error) {
            console.log(error)
        }
    }
    async function DeletePlaylist(id) {
        try {
            let resp = await axios.delete(`/api/playlist/deletePlaylist/${id}`)
            console.log(resp)
            if (resp) {
                console.log("dne")
                dispatch(deletePlaylist({id:id,category:"public"}))
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (playlists.length < 1) {
        return <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">No Playlists Yet</p>
    }
    return <>

        <div className="md:grid lg:grid-cols-3 md:grid-cols-2 gap-4 lg:ml-3 " >
            {playlists?.map((playlist, index) => (
                <div className="max-w-md border rounded-lg shadow bg-white bg-opacity-5 hover:bg-opacity-10 border-gray-700 my-2" key={index} >
                    <img className="rounded-t-md max-h-56 object-cover w-full" src={final[index]?.thumbnail || "/src/assets/defPlaylist.png"} alt="" />
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


    </>
}

export default MyPlaylist