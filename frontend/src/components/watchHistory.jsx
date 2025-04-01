import { useDispatch, useSelector } from "react-redux"
import { removeVideoFromHistory,clearWatchHistory } from "../slices/watchHistorySlice"
import { setCurrentVideo } from "../slices/currentVideoSlice"
import { useNavigate } from "react-router-dom"
import axios from "axios"

function WatchHistory() {

    const navigate=useNavigate()
    const dispatch = useDispatch()

    const watchedVideos = useSelector(state => state.history.historyVideos)
    console.log(watchedVideos)

   async function removeVideo(id) {
        let resp=await axios.patch(`/api/user/delfromWatchHistory/${id}`)
        if(resp){
            dispatch(removeVideoFromHistory(id))
        }
    }
   async function clearHistory() {
        let resp=await axios.patch("/api/user/clearWatchHistory")
        if(resp){
            dispatch(clearWatchHistory())
        }
    }

    async function navigateToVideoPage(videoId) {
        let resp = await axios.get(`/api/video/playVideo/${videoId}`)
        if(resp){
            dispatch(setCurrentVideo(resp.data.data))
            navigate("../wvp")
        }
    }

    if (watchedVideos.length < 1) {
        return <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
            <div className="p-3 rounded-lg mt-14 overflow-clip">
            <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56">No Video In Watch History</p>

            </div>
        </div>
    }

    return <div className="p-1 md:p-2 sm:ml-56 scrollbar-custom ">
        <div className="p-1 rounded-lg mt-14 ">

            <header className="flex justify-between text-white mb-3">
                <p className="lg:text-3xl text-2xl fontStyle font-bold">Watch History</p>
                <button onClick={clearHistory} className="bg-red-600 px-1 rounded-lg font-semibold text-sm hover:bg-red-700">Clear Watch History</button>
            </header>

            {
                watchedVideos.map((video) => (
                    <div key={video._id}
                        className="flex flex-col max-h-90 md:max-h-56 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20 p-1  bg-white bg-opacity-5 mb-2 md:p-2  my-2" onClick={()=>navigateToVideoPage(video._id)}>

                        <img className="object-cover rounded-lg  h-52 md:min-w-80 md: md:rounded-lg" src={video.thumbnail} alt="thunbnail" />
                        <div className="flex md:w-full md:pl-3">

                            <div className='md:hidden h-12 w-12 m-2 rounded-full '>
                                <img src={video.videoCreator[0].avatar || "/src/assets/defaultAvatar.png"} alt="channel bgPic" className='object cover w-full h-full rounded-full' />
                            </div>
                            <div className="flex items-center md:items-start justify-between pl-1 pt-1  leading-normal  w-full">
                                <div>
                                    <h5 className="mb-1 text-xl md:text-2xl font-bold tracking-tight text-slate-300 md:max-h-24 max-h-[50px]  overflow-hidden">
                                        {video.title}
                                    </h5>
                                    <div className="md:flex items-center">
                                        <div className='hidden md:block h-8 w-8 m-2 rounded-full'>
                                            <img src={video.videoCreator[0].avatar || "/src/assets/defaultAvatar.png"} alt="" className='object cover w-full h-full rounded-full' />
                                        </div>
                                        <p className="mb-1 text-slate-300">
                                            {video.videoCreator[0].username}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative text-left">

                                    <img
                                        src="/src/assets/delete.png"
                                        alt="More"
                                        className="cursor-pointer min-w-8 h-8 "
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            removeVideo(video._id)
                                        }}
                                    />

                                </div>

                            </div>
                        </div>
                    </div>
                ))
            }



        </div>
    </div>

}

export default WatchHistory