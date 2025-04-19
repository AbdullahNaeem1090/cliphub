
import { useSelector,useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { addToWatchHistory, setCurrentVideo } from "../slices/currentVideoSlice"

function SubscribedChannelVideos() {
    const channel = useSelector(state => state.followedTo.channel)
const navigate=useNavigate()
const dispatch=useDispatch()

    async function navigateToVideoPage(videoId) {
        try {
            let resp = await axios.get(`/api/video/playVideo/${videoId}`)
            if(resp){
                dispatch(setCurrentVideo(resp.data.data))
                dispatch(addToWatchHistory(videoId))
                console.log(resp)
                navigate("../wvp")
            }
        } catch (error) {
            console.log(error)
        }

    }
    if(channel[0].videos.length<1){
        return <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">No Videos by {channel[0].username} yet</p>
    }

    return <div className="lg:w-full lg:max-h-[582px] ">
        <p className="text-white text-3xl font-serif text-center bg-black bg-opacity-50 my-2 py-2 rounded-md lg:mt-0">Videos</p>
        <div className="    lg:overflow-y-scroll h-[515px] scrollbar-hide">
            {
                channel[0].videos.map((video,index) => (
                    <div key={index}  onClick={()=>navigateToVideoPage(video._id)}
                        className="flex flex-col max-h-90 md:max-h-56 lg:max-h-52 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20 p-1  bg-white bg-opacity-5 mb-2 md:p-2  my-2
                    ">

                        <img className="object-cover rounded-lg  h-52 lg:h-48 md:min-w-80 md: md:rounded-lg" src={video.thumbnail} alt="thunbnail" />
                        <div className="flex md:w-full md:pl-3 j">
                            <div className='md:hidden h-12 w-12 m-2 rounded-full '>
                                <img src={channel[0].avatar||"/src/assets/defaultAvatar.png" } alt="channel bgPic" className='object cover w-full h-full rounded-full' />
                            </div>
                            <div className="flex items-center md:items-start justify-between pl-1 pt-1  leading-normal  w-full">
                                <div>
                                    <h5 className="mb-1 text-xl md:text-2xl font-bold tracking-tight text-slate-300  max-h-24  overflow-hidden">
                                        {video.title}
                                    </h5>
                                    <div className="md:flex items-center">
                                        <div className='hidden md:block h-8 w-8 m-2 rounded-full'>
                                            <img src={channel[0].avatar||"/src/assets/defaultAvatar.png"} alt="" className='object cover w-full h-full rounded-full' />
                                        </div>
                                        <p className="mb-1 text-slate-300">
                                            {channel[0].username}
                                        </p>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                ))
            }


        </div>

    </div>
}

export default SubscribedChannelVideos