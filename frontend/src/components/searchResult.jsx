import { useNavigate, useOutletContext } from "react-router-dom"
import { useDispatch } from "react-redux"
import axios from "axios"
import { setCurrentVideo } from "../slices/currentVideoSlice"


function SearchResultVideosPage() {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const result = useOutletContext()

    async function navigateToVideoPage(videoId) {
        let resp = await axios.get(`/api/video/playVideo/${videoId}`)
        if (resp) {
            dispatch(setCurrentVideo(resp.data.data))
            navigate("/main/wvp")
        }
    }

    if (result.length < 1) {
        return <div className="p-3 md:p-4 sm:ml-56">
            <div className="p-4 rounded-lg mt-14">
                <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-56">No Video Found For This Search</p>
            </div>
        </div>

    }

    return (
        <>
            <div className="p-3 md:p-4 sm:ml-56">
                <div className="p-1 rounded-lg mt-14">

                    {
                        result?.map((video) => (
                            <div key={video._id} className="flex flex-col max-h-96 md:min-h-60 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20  bg-white bg-opacity-0 p-1  mb-2 md:p-2 md:mb-0" onClick={() => navigateToVideoPage(video._id)}>

                                <img className="object-cover rounded-lg h-52 md:min-w-80 md: md:rounded-lg" src={video.thumbnail} alt="" />

                                <div className="flex md:w-full md:pl-3">
                                    <div className='md:hidden h-12 w-12 m-2 rounded-full '>
                                        <img src={video.avatar || "/src/assets/defaultAvatar.png"} alt="" className='object cover w-full h-full rounded-full' />
                                    </div>
                                    <div className="flex flex-col pl-1 pt-1  leading-normal md:w-full">
                                        <h5 className="mb-1 text-2xl font-bold tracking-tight text-slate-200  max-h-24  overflow-hidden">
                                            {video.title}
                                        </h5>
                                        <div className="md:flex items-center">
                                            <div className='hidden md:block h-6 max-w-6 m-2 rounded-full'>
                                                <img src={video.avatar || "/src/assets/defaultAvatar.png"} alt="" className='object cover w-full h-full rounded-full' />
                                            </div>
                                            <p className="mb-1 text-slate-300">
                                                {video.username}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))

                    }





                </div>
            </div>

        </>
    )
}
export default SearchResultVideosPage