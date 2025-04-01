import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCurrentVideo,addToWatchHistory } from "../slices/currentVideoSlice";
import { setPlaylistVideos } from "../slices/playistVideosSlice";
import { useNavigate } from "react-router-dom";

function SubscribedChannelPlaylists() {

    const channel = useSelector(state => state.followedTo.channel)
    const dispatch=useDispatch()
    const navigate=useNavigate()

    async function navigateToVideoPage(index) {
        let videoId =  channel[0].playlists[index].videos[0]
        console.log(videoId)
        try {
            console.log("po")
            let resp = await axios.get(`/api/video/playVideo/${videoId}`)
            let resp1 = await axios.get(`/api/playlist/playlistVideos/${channel[0].playlists[index]._id}`)
            console.log("do")
            dispatch(setCurrentVideo(resp.data.data))
            dispatch(addToWatchHistory(videoId))
            dispatch(setPlaylistVideos(resp1.data.data))
            navigate("/main/playlist")
        } catch (error) {
            console.log(error)
        }
    }


    if (channel[0].playlists.length < 1) {
        return <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">No Playlists by {channel[0].username} yet</p>
    }

    return <>
        <div className="lg:w-full lg:max-h-[582px] ">
            <p className="text-white text-3xl font-serif text-center bg-black bg-opacity-50 my-2 py-2 rounded-md lg:mt-0">Playlists</p>
            <div className="lg:overflow-y-scroll lg:h-[515px] scrollbar-hide">

                <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-2 justify-items-center" >

                    {
                        channel[0].playlists.map((playlist,index) => (
                            <div key={index} className="max-w-sm border rounded-lg shadow bg-white bg-opacity-5 hover:bg-opacity-10 border-gray-700 my-2"  >

                                <img className="rounded-t-md h-56 w-full object-cover" src="/src/assets/defPlaylist.png" alt="" />


                                <div className="p-2">
                                    <h5 className="mb-1 text-2xl font-bold text-white">{playlist?.title}</h5>

                                    <p className="mb-2 font-normal text-gray-300 dark:text-gray-400">Videos:{channel[0].playlists[index].videos.length}</p>
                                    <button className="inline-flex items-center px-3 py-1 text-lg font-bold text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 cursor-pointer" onClick={()=>navigateToVideoPage(index)}>
                                        Watch
                                    </button>
                                </div>
                            </div>
                        ))
                    }



                </div>

            </div>

        </div>



    </>
}
export default SubscribedChannelPlaylists