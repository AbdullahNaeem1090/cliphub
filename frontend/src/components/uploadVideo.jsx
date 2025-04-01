import { useState } from "react"
import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from "react-redux"
import { addVideoToArray } from "../slices/myVideoSlice"
import { newComerVideo } from "../slices/allVideosSlice"
import axios from "axios"

function UploadVideo() {
    console.log("upload video rendred")
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()
    const currUser = useSelector((state) => state.user.currUser)
    const [waiter, setWaiter] = useState(false)
    const [done, setDone] = useState(false)
    const [msg,setmsg]=useState("")

    function clearAllInputs() {
        const videoInput = document.getElementById('dropzone-file');
        if (videoInput) {
          videoInput.value = '';
        }
        const thumbnailInput = document.getElementById('dropzone-file-pic');
        if (thumbnailInput) {
          thumbnailInput.value = '';
        }
        const titleInput = document.getElementById('title');
        if (titleInput) {
          titleInput.value = '';
        }
        const descriptionTextarea = document.getElementById('desc');
        if (descriptionTextarea) {
          descriptionTextarea.value = '';
        }
      }
      

    async function onUpload(data) {
        const formData = new FormData();
        formData.append('vid', data.video[0]);
        formData.append('pic', data.thumbnail[0]);
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('owner', currUser._id);

        try {
            setWaiter(true)
            let resp = await axios.post('/api/video/uploadVideo', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (resp) {
                clearAllInputs()
                setWaiter(false)
                setmsg(resp.data.message)
                setDone(true)
                setTimeout(() => {
                    setDone(false)
                }, 3000);
                console.log(resp.data.data)
                dispatch(addVideoToArray(resp.data.data))
                dispatch(newComerVideo({
                    title: resp.data.data.title,
                    thumbnail: resp.data.data.thumbnail,
                    _id: resp.data.data._id,
                    username: currUser.username,
                    avatar: currUser.avatar
                }))
                console.log("done")
            }
        } catch (error) {
            setWaiter(false)
            setmsg(error.response.message)
            setDone(true)
            setTimeout(() => {
                setDone(false)
            },3000);
        }
    }


    return <>
        <form onSubmit={handleSubmit(onUpload)} >
            <div className="flex mt-5 items-center">

                {/* ---------------------Video Uploading Area-------------- */}

                <div className="flex items-center justify-center w-full lg:w-[40%] lg:mx-auto mx-1  ">
                    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-56 border-2 rounded-3xl cursor-pointe hover:bg-gray-800 bg-gray-700 bg-opacity-30 border-gray-600 hover:border-gray-500 ">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <img src="/src/assets/upload.png" className="w-8 h-8 mb-4text-gray-400" alt="" />
                            <p className="mb-2 text-sm text-gray-400"> Click or drag and drop</p>
                            <p className="text-2xl text-gray-200">Video</p>
                        </div>
                        <input id="dropzone-file"
                            type="file"
                            accept="video/*"
                            className="hidden md:block text-green-400 rounded-2xl "
                            {...register('video', { required: 'video file is required' })} />
                        {errors.video && <p className="text-red-400">{errors.video.message}</p>}
                    </label>
                </div>

                {/* ---------------------Thumbnail Uploading Area-------------- */}

                <div className="flex items-center justify-center w-full lg:w-[40%] lg:mx-auto mx-1">
                    <label htmlFor="dropzone-file-pic" className="flex flex-col items-center justify-center w-full h-56 border-2 rounded-3xl cursor-pointe hover:bg-gray-800 bg-gray-700 bg-opacity-30 border-gray-600 hover:border-gray-500 ">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <img src="/src/assets/upload.png" className="w-8 h-8 mb-4text-gray-400" alt="" />
                            <p className="mb-2 text-sm text-gray-400"> Click or drag and drop</p>
                            <p className="text-2xl text-gray-200">Thumbnail</p>
                        </div>
                        <input id="dropzone-file-pic"
                            type="file"
                            accept="image/*"
                            className="hidden md:block text-purple-400 rounded-2xl"
                            {...register('thumbnail', { required: 'thumbnail is required' })} />
                        {errors.thumbnail && <p className="text-red-400">{errors.thumbnail.message}</p>}
                    </label>
                </div>
            </div>

            {/* -----------------------Title--------------------------------- */}

            <div className=" flex flex-col space-y-1 lg:w-2/3 lg:mx-auto mt-3">
                <p className="text-white text-2xl">Title</p>
                <input type="text"
                  id="title"
                    className="bg-opacity-0 bg-white border-none focus:outline-none focus:ring-0 text-white"
                    placeholder="Write Your Title Here . . ."
                    {...register('title', { required: 'title is required' })} />
                {errors.title && <p className="text-red-400">{errors.title.message}</p>}
                <div className="border-b"></div>

                {/* ---------------------Desription Uploading Area-------------- */}

                <p className="text-white text-2xl pt-5 pb-3">Description</p>
                <textarea id="desc" className="bg-opacity-5 bg-white rounded-lg text-white p-2"
                    {...register("description")}></textarea>
                <div className="py-2"></div>

                {/* ---------------------Form Submiting Button-------------- */}

                <div className={waiter && "waiter mx-auto "} ></div>
                <p className={done ? "mx-auto text-3xl text-green-500" : "hidden"} >{msg}</p>

                <input type="submit" value="Upload" className={waiter ? "hidden" : "bg-blue-700 text-white rounded-lg py-1 font-semibold text-2xl font-sans lg:w-1/3 lg:mx-auto cursor-pointer hover:bg-blue-500 "} />
            </div>

        </form>
    </>
}

export default UploadVideo