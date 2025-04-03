import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { addVideoToArray } from "../slices/myVideoSlice";
import { newComerVideo } from "../slices/allVideosSlice";
import axios from "axios";
import { CustomToast } from "../utils/showUtils";
import { finishProgress, showProgress } from "../slices/videoUploadSlice";

function UploadVideo() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const currUser = useSelector((state) => state.user.currUser);
  const videoUpload = useSelector((state) => state.videoUpload);
  const uploadController = useRef(null);

  function clearAllInputs() {
    const videoInput = document.getElementById("dropzone-file");
    if (videoInput) {
      videoInput.value = "";
    }
    const thumbnailInput = document.getElementById("dropzone-file-pic");
    if (thumbnailInput) {
      thumbnailInput.value = "";
    }
    const titleInput = document.getElementById("title");
    if (titleInput) {
      titleInput.value = "";
    }
    const descriptionTextarea = document.getElementById("desc");
    if (descriptionTextarea) {
      descriptionTextarea.value = "";
    }
  }

  async function onUpload(data) {
    const formData = new FormData();
    formData.append("vid", data.video[0]);
    formData.append("pic", data.thumbnail[0]);
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("owner", currUser._id);

    if (uploadController.current) {
      uploadController.current.abort();
    }
    uploadController.current = new AbortController();
    const signal = uploadController.current.signal;

    try {
      dispatch(showProgress());

      let resp = await axios.post("/api/video/uploadVideo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        signal,
      });
      if (resp) {
        let re = await axios.get(
          `/api/video/setVerifyTrue/${resp.data.data._id}`
        );
        console.log(re);
        clearAllInputs();
        dispatch(finishProgress());
        CustomToast(dispatch, "✅ Video Upladed");
        dispatch(addVideoToArray(resp.data.data));
        dispatch(
          newComerVideo({
            title: resp.data.data.title,
            thumbnail: resp.data.data.thumbnail,
            _id: resp.data.data._id,
            username: currUser.username,
            avatar: currUser.avatar,
          })
        );
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Upload canceled by user!");
      }
      dispatch(finishProgress());
    }
  }

  function cancelUpload() {
    if (uploadController.current) {
      clearAllInputs();
      dispatch(finishProgress());
      uploadController.current.abort();
      console.log("Upload canceled!");
      CustomToast(dispatch, "✖️ Uploading Cancelled");
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onUpload)}>
        <div className="flex mt-5 items-center">
          {/* ---------------------Video Uploading Area-------------- */}

          <div className="flex items-center justify-center w-full lg:w-[40%] lg:mx-auto mx-1  ">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-56 border-2 rounded-3xl cursor-pointe hover:bg-gray-800 bg-gray-700 bg-opacity-30 border-gray-600 hover:border-gray-500 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img
                  src="/src/assets/upload.png"
                  className="w-8 h-8 mb-4text-gray-400"
                  alt=""
                />
                <p className="mb-2 text-sm text-gray-400">
                  {" "}
                  Click or drag and drop
                </p>
                <p className="text-2xl text-gray-200">Video</p>
              </div>
              <input
                id="dropzone-file"
                type="file"
                accept="video/*"
                className="hidden md:block text-green-400 rounded-2xl "
                {...register("video", { required: "video file is required" })}
              />
              {errors.video && (
                <p className="text-red-400">{errors.video.message}</p>
              )}
            </label>
          </div>

          {/* ---------------------Thumbnail Uploading Area-------------- */}

          <div className="flex items-center justify-center w-full lg:w-[40%] lg:mx-auto mx-1">
            <label
              htmlFor="dropzone-file-pic"
              className="flex flex-col items-center justify-center w-full h-56 border-2 rounded-3xl cursor-pointe hover:bg-gray-800 bg-gray-700 bg-opacity-30 border-gray-600 hover:border-gray-500 "
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <img
                  src="/src/assets/upload.png"
                  className="w-8 h-8 mb-4text-gray-400"
                  alt=""
                />
                <p className="mb-2 text-sm text-gray-400">
                  {" "}
                  Click or drag and drop
                </p>
                <p className="text-2xl text-gray-200">Thumbnail</p>
              </div>
              <input
                id="dropzone-file-pic"
                type="file"
                accept="image/*"
                className="hidden md:block text-purple-400 rounded-2xl"
                {...register("thumbnail", {
                  required: "thumbnail is required",
                })}
              />
              {errors.thumbnail && (
                <p className="text-red-400">{errors.thumbnail.message}</p>
              )}
            </label>
          </div>
        </div>

        {/* -----------------------Title--------------------------------- */}

        <div className=" flex flex-col space-y-1 lg:w-2/3 lg:mx-auto mt-3">
          <p className="text-white text-2xl">Title</p>
          <input
            type="text"
            id="title"
            className="bg-opacity-0 bg-white border-none focus:outline-none focus:ring-0 text-white"
            placeholder="Write Your Title Here . . ."
            {...register("title", { required: "title is required" })}
          />
          {errors.title && (
            <p className="text-red-400">{errors.title.message}</p>
          )}
          <div className="border-b"></div>

          {/* ---------------------Desription Uploading Area-------------- */}

          <p className="text-white text-2xl pt-5 pb-3">Description</p>
          <textarea
            id="desc"
            className="bg-opacity-5 bg-white rounded-lg text-white p-2"
            {...register("description")}
          ></textarea>
          <div className="py-2"></div>

          {/* ---------------------Form Submiting Button-------------- */}

          <div
            className={
              videoUpload.showUploadProgressBar && "waiter mx-auto mb-2 "
            }
          ></div>

          <input
            type="submit"
            value="Upload"
            className={
              videoUpload.showUploadProgressBar
                ? "hidden"
                : "bg-blue-700 text-white rounded-lg py-1 font-semibold text-2xl font-sans lg:w-1/3 lg:mx-auto cursor-pointer hover:bg-blue-500 "
            }
          />
          <button
            className={
              videoUpload.showUploadProgressBar
                ? "bg-red-600 text-white rounded-xl py-1 mt-4 font-semibold text-xl font-sans lg:w-1/3 lg:mx-auto cursor-pointer hover:bg-red-700 "
                : "hidden"
            }
            onClick={cancelUpload}
          >
            Cancel Upload
          </button>
        </div>
      </form>
    </>
  );
}

export default UploadVideo;
