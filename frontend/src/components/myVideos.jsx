import {  useState } from "react"
import axios from "axios"
import { useDispatch, useSelector } from "react-redux"
import { setTempVideoArray } from "../slices/myVideoSlice"
import { setPlaylist, addToPlaylist } from "../slices/playlistSlice"
import { setCurrentVideo,addToWatchHistory } from "../slices/currentVideoSlice"
import { useNavigate } from "react-router-dom"
import { remVideoFromPlaylist } from "../slices/playlistSlice"
import { removeVideoFromHomePage } from "../slices/allVideosSlice"

function MyVideos() {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [openDropdownId, setOpenDropdownId] = useState(null);
    const [plCard, setPlCard] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);


    const toggleDropdown = (id) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const owner = useSelector(state => state.myVideos.myVideoList.username)
    const videos = useSelector(state => state.myVideos.myVideoList.videoList)
    const avatar = useSelector(state => state.user.currUser.avatar)
    const playlists = useSelector(state => state.playlist.myplaylists)
    console.log(owner)
    async function handleDelete(videoId) {
        try {
            console.log(videoId)
            let resp = await axios.delete(`/api/video/delVideo/${videoId}`)
            if (resp.data.success) {
                let tempVideoArray = videos.filter((video) => {
                    return video._id !== videoId
                })
                dispatch(setTempVideoArray(tempVideoArray))
                dispatch(removeVideoFromHomePage(videoId))
                dispatch(remVideoFromPlaylist({
                    category: "both",
                     videoId:videoId
                }))
            }
        } catch (error) {
            console.log(error)
        }
    }

    const [videoIdPlaylist, setVideoIdPlaylist] = useState("")

    function getInputValue() {
        const inputElement = document.getElementById('myInput')
        return inputElement
    }
    function showToast() {
        const toast = document.getElementById('toast-notification');
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 3000);
    }

    async function createPlaylist() {

        let playlistTitle = getInputValue()

        const firstvideoForPlaylist = {
            title: playlistTitle.value,
            playlistVideo: [videoIdPlaylist],
            category: "public"
        }
        console.log(firstvideoForPlaylist)
        try {
            let resp = await axios.post("/api/playlist/createMyPlaylist", firstvideoForPlaylist)
            if (resp.data.statusCode == 200) {
                showToast()
                dispatch(setPlaylist(resp.data.data, { category: "public" }))
                playlistTitle.value = ""
                setPlCard(false)
                setOpenCreate(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function newVideoInPL(pl_Name, index) {
        console.log(pl_Name, videoIdPlaylist)
        try {
            let resp = await axios.post("/api/playlist/addVideoToPlaylist", { pl_Name, videoIdPlaylist })
            if (resp) {
                console.log(resp)
                dispatch(addToPlaylist({ videoIdPlaylist, index, category: "public" }))
                showToast()
                setPlCard(false)
                setOpenCreate(false)
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function navigateToVideoPage(videoId) {
        let resp = await axios.get(`/api/video/playVideo/${videoId}`)
        if(resp){
            dispatch(setCurrentVideo(resp.data.data))
            dispatch(addToWatchHistory(videoId))
            navigate("../wvp")
        }
    }

    if (videos.length < 1) {
        return <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">No Video Uploaded</p>
    }

    return <>

        {
            videos.map(video => (
                <div key={video._id} >
                    <div onClick={() => navigateToVideoPage(video._id)}
                        className="flex flex-col max-h-90 md:max-h-56 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20 p-1  bg-white bg-opacity-5 mb-2 md:p-2  my-2">

                        <img className="object-cover rounded-lg  h-52 md:min-w-80 md: md:rounded-lg" src={video.thumbnail ? video.thumbnail : "/src/assets/tn1.jpg"} alt="thunbnail" />
                        <div className="flex md:w-full md:pl-3 j">

                            <div className='md:hidden h-12 w-12 m-2 rounded-full '>
                                <img src={avatar || "/src/assets/defaultAvatar.png"} alt="channel bgPic" className='object cover w-full h-full rounded-full' />
                            </div>
                            <div className="flex items-center md:items-start justify-between pl-1 pt-1  leading-normal  w-full">
                                <div>
                                    <h5 className="mb-1 text-xl md:text-2xl font-bold tracking-tight text-slate-300  max-h-24  overflow-hidden">
                                        {video.title}
                                    </h5>
                                    <div className="md:flex items-center">
                                        <div className='hidden md:block h-8 w-8 m-2 rounded-full'>
                                            <img src={avatar || "/src/assets/defaultAvatar.png"} alt="" className='object cover w-full h-full rounded-full' />
                                        </div>
                                        <p className="mb-1 text-slate-300">
                                            {owner}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative inline-block text-left">
                                    {/* Dropdown button with image */}
                                    <img
                                        src="/src/assets/more.png"
                                        alt="More"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            toggleDropdown(video._id);
                                        }}
                                        className="cursor-pointer w-8 h-8 "
                                    />

                                    {/* Dropdown menu */}
                                    {openDropdownId === video._id && (
                                        <div className="absolute right-0 mt-2 z-10  divide-y divide-gray-100 rounded-lg shadow w-44 bg-black bg-opacity-70">
                                            <ul className="py-2 text-sm  text-gray-200">
                                                <li>
                                                    <button
                                                        onClick={(e) => {
                                                            handleDelete(video._id)
                                                            e.stopPropagation()
                                                        }
                                                        }
                                                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                                                    >
                                                        Delete
                                                    </button>
                                                </li>
                                                <li>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            setPlCard(true)
                                                            setVideoIdPlaylist(video._id)
                                                        }}
                                                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                                                    >
                                                        Add to playlist
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div >

            ))
        }



        <div className={plCard ? " fixed z-50 top-[45%] md:left-[50%] left-[23%]  w-52 text-sm font-medium  rounded-lg bg-black bg-opacity-70 border-gray-600" : "hidden"}>
            <button type="button" className="flex justify-between w-full px-4 py-2 font-xl text-left text-white rounded-t-lg cursor-pointer  bg-black bg-opacity-70">
                Add Video to <div onClick={() => {
                    setPlCard(false)
                    setOpenCreate(false)
                }} ><img src="/src/assets/close.png" className="h-5 w-5" alt="" /></div>
            </button>
            {playlists && playlists.length > 0 && playlists.map((suggestion, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => newVideoInPL(suggestion.title, index)}
                    className="w-full px-4 py-2 font-medium text-left rtl:text-right cursor-pointer  hover:bg-white hover:bg-opacity-5 text-gray-300"
                >
                    {suggestion.title}
                </button>
            ))}

            <button type="button" className="w-full flex justify-between px-4 py-2 font-medium text-left rtl:text-right  cursor-pointer text-gray-300 hover:bg-white hover:bg-opacity-5" onClick={() => setOpenCreate(true)} >
                Create Playlist <img src="/src/assets/add.png" className="h-5 w-5" alt="" />
            </button>
            <div className={openCreate ? "flex flex-col " : "hidden"}>
                <input id="myInput" type="text" placeholder="Playlist Name" className="m-2 p-1 w-auto border rounded-lg text-white bg-gray-800 border-gray-600 focus:outline-none " />

                <button onClick={createPlaylist} className="mx-2 my-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                    Create
                </button>
            </div>
        </div>

        <div id="toast-notification" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden" role="alert">
            <span className="text-sm font-semibold text-gray-300">Video Added to Playlist ✅</span>
        </div>

    </>
}


export default MyVideos