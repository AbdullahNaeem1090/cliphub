import { useDispatch, useSelector, } from "react-redux"
import { useEffect, useRef, useState } from "react";
import { addTempComment, addTempReply, manageTempSubscriber, remTempComment, remTempReply, manageTempLikes, addTempPlaylistId, memberRemoval } from "../slices/currentVideoSlice";
import { setCurrentVideo,addToWatchHistory } from "../slices/currentVideoSlice";
import axios from "axios";
import {  remVideofromPlaylist, addVideoToPlaylist } from "../slices/playlistSlice";
import { addlikedVideo, removelikedVideo } from "../slices/likeSlice";
import { addSubscribedChannel, removeSubscribedChannel } from "../slices/subscriptionSlice";
import { updateRemoval, updateAddition } from "../slices/playistVideosSlice";

function PlaylistMode() {

    const currVideo = useSelector(state => state.currentVideo.currentVideo[0])
    const comment_Author = useSelector(state => state.user.currUser._id)
    const currUser = useSelector(state => state.user.currUser)
    const playlistVideos = useSelector(state => state.plVideos.playlistVideos)
    const playlists = useSelector(state => state.playlist.privatePlaylists)
    const likes = useSelector(state => state.likes.likedVideos)
    const subscribedChannels = useSelector(state => state.subscribe.subscribedChannels)
    const fetchedVideos = useSelector(state => state.allVideos.gatheredVideos)
    const { thumbnail: Thumbnail } = fetchedVideos.find((obj) => obj._id === currVideo._id) || {}
    console.log(Thumbnail)

    console.log(playlistVideos)

    const [plCard, setPlCard] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);

    const dispatch = useDispatch()
    console.log("==>", currVideo)
    const commentRef = useRef()

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currVideo.videoURL])

    const [showComment, setShowComment] = useState(false)
    const [showRepInp, setShowRepInp] = useState(false)
    const [showRepliess, setShowReplies] = useState(false)
    const [commBoxId, setCommBoxId] = useState('')
    const [repButtonId, setRepButtonId] = useState('')
    const [description,setdescription]=useState(false)


    function showToast(id) {
        const toast = document.getElementById(id);
        toast.classList.remove('hidden');
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 2000);
    }
    function showComments() {
        setShowComment((prev) => !prev)
    }

    function showReplyInput(Comment_id) {
        setShowRepInp((prev) => !prev)
        setCommBoxId(Comment_id)
    }
    function showReplies(Comment_id) {

        setShowReplies((prev) => !prev)
        setRepButtonId(Comment_id)
    }

    async function getComment(ParentComment_id, author, index) {
        const inputElement = document.getElementById('comment_text')
        let rep_comment = inputElement.value
        let resp = await axios.post("/api/comment/postReply", {
            ParentComment_id, rep_comment, author
        })
        if (resp) {
            let replyObj = resp.data.data
            replyObj.repliers = [{
                avatar: currUser.avatar,
                username: currUser.username
            }]
            delete replyObj._id
            delete replyObj.author
            delete replyObj.__v
            inputElement.value = ""
            dispatch(addTempReply({ replyObj, index }))
            showToast("comment-noti")
        }
    }

    async function postComment(author, Commented_Video_id) {
        let comment = commentRef.current.value

        let resp = await axios.post("/api/comment/post",
            {
                author,
                Commented_Video_id,
                comment
            })
        if (resp) {
            let commentObj = resp.data.data
            commentObj.commenter = [{
                avatar: currUser.avatar,
                username: currUser.username,
                _id: currUser._id
            }]
            delete commentObj.Commented_Video_id
            delete commentObj.replies
            delete commentObj.__v

            dispatch(addTempComment(commentObj))
            commentRef.current.value = ""
            showToast("comment-noti")
        }

    }

    async function subscribe() {
        let resp = await axios.post("/api/subscription/subscribe", {
            subscriber: currUser._id,
            subscribedTo: currVideo.ownerDetails[0]._id
        })
        if (resp.data.data.subscriber == currUser._id) {
            dispatch(manageTempSubscriber(1))
            dispatch(addSubscribedChannel({
                _id: "abc123"
                , subscribedTo: currVideo.ownerDetails[0]._id
            }))
            showToast("subscribe-noti")
        }

    }

    async function unSubscribe() {
        let resp = await axios.post("/api/subscription/unSubscribe", {
            subscriber: currUser._id,
            subscribedTo: currVideo.ownerDetails[0]._id
        })
        if (resp.data.data.deletedCount == 1) {
            dispatch(manageTempSubscriber(0))
            dispatch(removeSubscribedChannel(currVideo.ownerDetails[0]._id))
            showToast("unSubscribe-noti")
        }
    }

    async function deleteComment(commentId, index) {
        let resp1 = await axios.delete(`/api/comment/removeComment/${commentId}`)
        let resp2 = await axios.delete(`/api/comment/removeReply/${commentId}`)
        if (resp1 && resp2) {
            dispatch(remTempComment(index))
            dispatch(remTempReply(index))
        }
        showToast("delete-noti")
    }

    async function like(userId, videoId, func) {
        let resp = await axios.post(`/api/like/${func}`, {
            likedVideoId: videoId,
            likedById: userId
        })
        if (resp) {
            if (func == "addLike") {
                dispatch(manageTempLikes(1))
                dispatch(addlikedVideo({ _id: "abc123", likedVideoId: currVideo._id }))
            }
            else {
                dispatch(manageTempLikes(0))
                dispatch(removelikedVideo(currVideo._id))

            }
        }
    }

    async function changeVideo(videoId) {
        let resp = await axios.get(`/api/video/playVideo/${videoId}`)
        if (resp) {
            dispatch(setCurrentVideo(resp.data.data))
            dispatch(addToWatchHistory(videoId))
        }
    }
    function getInputValue() {
        const inputElement = document.getElementById('myInput')
        return inputElement
    }

    async function createPlaylist() {
        let playlistTitle = getInputValue()
        const firstvideoForPlaylist = {
            title: playlistTitle.value,
            playlistVideo: [currVideo._id],
            category: "private"
        }
        try {
            let resp = await axios.post("/api/playlist/createMyPlaylist", firstvideoForPlaylist)
            if (resp.data.statusCode == 200) {
                console.log("->", resp.data.data)
                // dispatch(setPlaylist(resp.data.data, { category: "private" }))
                dispatch(addTempPlaylistId(resp.data.data._id))
                playlistTitle.value = ""
                setPlCard(false)
                setOpenCreate(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
    async function newVideoInPL(pl_Name, index) {
        try {

            let resp = await axios.post("/api/playlist/addVideoToPlaylist", { pl_Name, videoIdPlaylist: currVideo._id })
            if (resp) {
                dispatch(addVideoToPlaylist({ videoIdPlaylist: currVideo._id, index, category: "private" }))
                dispatch(addTempPlaylistId(resp.data.data))
                dispatch(updateAddition({
                    _id: currVideo._id,
                    thumbnail: Thumbnail,
                    title: currVideo.title,
                    videoCreator: [{
                        avatar: currVideo.ownerDetails[0].avatar,
                        username: currVideo.ownerDetails[0].username,
                        _id: "abc123"
                    }]
                }))
                setPlCard(false)
                setOpenCreate(false)
                showToast("addedtoPl")
            }
        } catch (error) {
            console.log(error)
        }
    }

    async function removeVideoFromPlaylist() {
        let playlistId = playlists.find((playlist) =>
            playlist.videos.includes(currVideo._id))?._id
        let resp = await axios.patch(`/api/playlist/removeVideo/${currVideo._id}/${playlistId}/${"private"}`)
        if (resp) {
            dispatch(remVideofromPlaylist({
                category: "private", videoId: currVideo._id
            }))

            dispatch(memberRemoval(playlistId))
            dispatch(updateRemoval(currVideo._id))
            showToast("removed")
        }
    }

    return <>
        <div className="p-3 md:p-2 sm:ml-56 scrollbar-custom ">
            <div className="p-3 border-2 border-gray-600 border-dashed rounded-lg mt-14 lg:flex overflow-clip">

                <div className="w-auto">
                    <div className="mb-4 lg:max-w-[870px] lg:min-w-[870px]">
                        <div className=" overflow-hidden ">
                            <video src={currVideo?.videoURL} controls autoplay className="rounded-xl border-black object-cover lg:min-w-[870px]  max-h-[480px]" ></video>
                        </div>
                        <div >
                            <p className="text-white text-2xl font-bold py-2">{currVideo?.title}</p>
                            <div className="flex justify-between lg:max-w-[845px] ">
                                <div className="flex items-center">
                                    <div>
                                        <img src={currVideo?.ownerDetails[0]?.avatar || "/src/assets/defaultAvatar.png"} className="object-cover h-11 w-12 rounded-full" alt="" />
                                    </div>
                                    <div className="flex flex-col ml-2">
                                        <p className="text-white font-bold">
                                            {currVideo?.ownerDetails[0]?.username}
                                        </p>
                                        <p className="text-gray-100 text-sm">{currVideo.subscribersCount} Subscribers</p>
                                    </div>
                                </div>
                                <div className="flex lg:space-x-6 space-x-2">
                                    {
                                        playlists.some((playlist) =>
                                            playlist.videos.includes(currVideo._id)
                                        ) ?
                                            <button className="flex flex-col items-center" onClick={removeVideoFromPlaylist}>
                                                <img src="/src/assets/saved.png" alt="" className="md:h-8 md:w-8 h-6 w-6" />
                                                <p className="text-white text-sm">Added</p>
                                            </button>
                                            :
                                            <button className="flex flex-col items-center" onClick={() => setPlCard(true)}>
                                                <img src="/src/assets/save.png" alt="" className="md:h-8 md:w-8 h-6 w-6" />
                                                <p className="text-white text-sm">Add</p>
                                            </button>
                                    }

                                    {likes.length > 0 && likes.some((obj) => obj.likedVideoId === currVideo._id) ? <button onClick={() => like(currUser._id, currVideo._id, "removeLike")}>
                                        <img src="/src/assets/liked.png" alt="" className="md:h-8 md:w-8 h-6 w-6" />
                                        <p className="text-white">{currVideo.likes_count}</p>
                                    </button> :
                                        <button onClick={() => like(currUser._id, currVideo._id, "addLike")}>
                                            <img src="/src/assets/like.png" alt="" className="md:h-8 md:w-8 h-6 w-6" />
                                            <p className="text-white">{currVideo.likes_count}</p>
                                        </button>
                                    }


                                    {subscribedChannels.length > 0 && subscribedChannels.some((obj) => obj.ContentCreators
                                    [0]._id === currVideo.ownerDetails[0]._id)
                                        ? <button onClick={unSubscribe} className="text-white rounded-full px-2 h-10 md:font-bold bg-gray-600 ml-5 hover:bg-slate-500">
                                            Subscribed
                                        </button>
                                        : <button onClick={subscribe} className="text-white rounded-full px-2 h-10 font-bold bg-red-600 ml-5 hover:bg-red-700">
                                            Subscribe
                                        </button>}



                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="bg-slate-950 h-auto p-4 rounded-lg lg:max-w-[845px] mb-2">
                        <div className="flex justify-between">
                            <p className="text-white font-bold text-2xl">Description</p>
                            <img src="/src/assets/logout.png" className="h-7 w-7 cursor-pointer" onClick={() => setdescription(prev => !prev)} alt="" />
                        </div>
                        {description && <p className="text-white ml-5 mt-2 text-xl">{currVideo.description}</p>}
                    </div>

                    <section className={`bg-white bg-opacity-5 rounded-lg  lg:py-8 antialiased lg:max-w-[845px] ${showComment ? "" : "h-40"} overflow-hidden lg:block lg:h-auto`}>
                        <div className="max-w-2xl mx-auto ">

                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-lg lg:text-2xl font-bold text-white">Comments {currVideo.comments.length}</h2>
                            </div>

                            <div className="mb-6">
                                <div className="p-2 mb-4 rounded-lg rounded-t-lg border border-gray-500">
                                    <textarea rows="1"
                                        className="w-full text-sm text-white rounded-md border-0 p-2 focus:ring-0 bg-black bg-opacity-5"
                                        ref={commentRef}
                                        placeholder="Write your comment..."
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-between">
                                    <button
                                        className="border-b text-white px-1 py-0.5 lg:hidden hover:border-gray-400 hover:text-gray-400" onClick={showComments}>
                                        Read Comments
                                    </button>
                                    <button
                                        onClick={() => postComment(comment_Author, currVideo._id)}
                                        className="bg-blue-600 rounded-lg text-white px-2 py-1 hover:bg-green-400">
                                        Post comment
                                    </button>
                                </div>
                            </div>
                            {/* comment */}
                            {
                                currVideo.comments.map((comment, index) => (
                                    <div key={comment._id}>
                                        <article className="p-6 text-base  bg-slate-950 bg-opacity-50 rounded-lg mb-4">

                                            <footer className="flex justify-between items-center mb-2">
                                                <div className="flex items-center">
                                                    <p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
                                                        <img className="mr-2 w-6 h-6 rounded-full"
                                                            src={comment?.commenter[0]?.avatar}
                                                            alt="Michael Gough" />{comment?.commenter[0]?.username}</p>
                                                </div>
                                                {currUser._id == comment.author &&

                                                    <img src="/src/assets/delete.png" className="h-6 w-6 cursor-pointer" alt="" onClick={() => deleteComment(comment._id, index)} />
                                                }
                                            </footer>

                                            <p className="text-gray-400">{comment?.comment}</p>
                                            <div className="flex items-center justify-between mt-4 space-x-4">
                                                <button onClick={() => showReplyInput(comment._id)}
                                                    className="flex items-center text-sm text-gray-500  font-medium">
                                                    <img src="/src/assets/reply.png" alt="" className="w-6 h-6 mr-2" />
                                                    Reply
                                                </button>
                                                <button className="text-purple-400 hover:underline " onClick={() => showReplies(comment._id)} >Replies</button>
                                            </div>
                                            {commBoxId == comment._id &&
                                                <div className={`w-full  mt-2 flex ${showRepInp ? "" : "hidden"}`}>
                                                    <input type="text" id="comment_text" className=" bg-blue-950 bg-opacity-70 rounded-lg w-full  focus:ring-0 text-white border-b-1 border-t-0 border-x-0 pl-1" placeholder="Reply" />
                                                    <img src="/src/assets/send.png" className="h-8 w-8 items-center cursor-pointer" alt="" onClick={() => {
                                                        getComment(comment._id, comment_Author, index)
                                                        setShowRepInp(false)
                                                    }} />
                                                </div>
                                            }
                                        </article>

                                        {currVideo.reply_array.map((obj) => (
                                            obj.replies
                                                .filter(reply => reply.ParentComment_id === comment._id)
                                                .map((reply) => (
                                                    <article key={reply._id} className={`${repButtonId == reply.ParentComment_id && showRepliess ? "" : "hidden "}p-6 mb-3 ml-6 lg:ml-16 text-base bg-slate-400 bg-opacity-20 rounded-lg`}>
                                                        <footer className="flex justify-between items-center mb-2">
                                                            <p className="inline-flex items-center mr-3 text-sm text-white font-semibold">
                                                                <img className="mr-2 w-6 h-6 rounded-full" src={reply.repliers[0].avatar} alt="Profile" />
                                                                {reply.repliers[0].username}
                                                            </p>
                                                        </footer>
                                                        <p className="text-slate-200">
                                                            {reply.rep_comment}
                                                        </p>
                                                    </article>
                                                ))
                                        ))}


                                    </div>
                                ))

                            }

                        </div>
                    </section>
                </div>

                {/* -------------------------------------------------------------------------------------------- */}
                <div className="flex-1 rounded-lg lg:ml-2 lg:border-l ">
                    <div className="hidden lg:block text-white font-extrabold text-2xl pl-3 mb-2">
                        Playlist
                    </div>
                    <div className="lg:h-[500px] overflow-y-scroll scrollbar-hide lg:border-y  ">

                        {
                            playlistVideos.map((video) => (
                                <div className={`flex flex-col max-h-96 md:h-60
                lg:h-36 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-white hover:bg-opacity-10 p-1 mt-1  mb-2 md:p-2 md:mb-0 ${currVideo._id === video._id && "bg-black bg-opacity-50"}`} onClick={() => changeVideo(video._id)}>

                                    <img className="object-cover rounded-lg  md:w-80 lg:w-44" src={video.thumbnail} alt="" />

                                    <div className="flex md:w-full md:pl-3">
                                        <div className='md:hidden h-12 min-w-12 m-2 rounded-full '>
                                            <img src={video.thumbnail} alt="" className='object cover w-full h-full rounded-full' />
                                        </div>
                                        <div className="flex flex-col pl-1 pt-1  leading-normal md:w-full">
                                            <h5 className="mb-1 text-xl  tracking-tight text-slate-200  max-h-36  overflow-hidden">
                                                {video.title}
                                            </h5>
                                            <div className="md:flex items-center">
                                                <div className='hidden md:block h-6 w-6 m-1 rounded-full'>
                                                    <img src={video.videoCreator[0].avatar} alt="" className='object cover w-full h-full rounded-full' />
                                                </div>
                                                <p className="mb-1 text-slate-300 text-sm">
                                                    {video.videoCreator[0].username}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>

                </div>

            </div>
        </div>


        <div className={plCard ? " fixed z-50 top-[45%] md:left-[50%] left-[23%]  w-52 text-sm font-medium border rounded-lg bg-gray-700 border-gray-600 text-white" : "hidden"}>
            <button type="button" className="flex justify-between w-full px-4 py-2 font-xl text-left text-white border-b rounded-t-lg cursor-pointer focus:outline-none bg-gray-800 border-gray-600 ">
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
                    className="w-full px-4 py-2 font-medium text-left rtl:text-right border-b cursor-pointer focus:outline-none focus:ring-1 border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500focus:text-white"
                >
                    {suggestion.title}
                </button>
            ))}

            <button type="button" className="w-full flex justify-between px-4 py-2 font-medium text-left rtl:text-right border-b cursor-pointer focus:outline-none focus:ring-1 border-gray-600 hover:bg-gray-600 hover:text-white focus:ring-gray-500focus:text-white" onClick={() => setOpenCreate(true)} >
                Create Playlist <img src="/src/assets/add.png" className="h-5 w-5" alt="" />
            </button>
            <div className={openCreate ? "flex flex-col " : "hidden"}>
                <input id="myInput" type="text" placeholder="Playlist Name" className="mt-2 py-1 w-full border rounded-lg text-white bg-gray-800 border-gray-600" />

                <button onClick={createPlaylist} className="mx-2 my-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg">
                    Create
                </button>
            </div>

        </div>


        <div id="comment-noti" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden" role="alert">
            <span className="text-sm font-semibold text-gray-300">Comment Posted ✅</span>
        </div>
        <div id="subscribe-noti" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden" role="alert">
            <span className="text-sm font-semibold text-gray-300">Channel Subscribed 📺</span>
        </div>
        <div id="unSubscribe-noti" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden" role="alert">
            <span className="text-sm font-semibold text-gray-300">Subscription Removed ➖</span>
        </div>
        <div id="delete-noti" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden " role="alert">
            <span className="text-sm font-semibold text-gray-300">Comment Deleted 🗑️ </span>

        </div>
        <div id="addedtoPl" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden " role="alert">
            <span className="text-sm font-semibold text-gray-300">Added to playlist </span>

        </div>
        <div id="removed" className="fixed bottom-4 right-4 w-full max-w-xs p-4 text-gray-300 bg-gray-800 rounded-lg shadow-lg hidden " role="alert">
            <span className="text-sm font-semibold text-gray-300">Removed from playlist </span>

        </div>

    </>
}

export default PlaylistMode