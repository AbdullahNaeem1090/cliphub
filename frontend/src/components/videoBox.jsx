import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { CustomToast } from "../utils/showUtils.js";

function VideoBox({
  navigateToVideoPage,
  video,
  channelName,
  avatar,
  dropDownId,
  setDropDownId,
  setVideoId,
  setOpenPlayListCard,
  deleteVideo,
  setShowForm,
  setEditVideoId,
  actions,
}) {
  const dispatch = useDispatch();


  function copyLink(videoLink) {
    navigator.clipboard
      .writeText(videoLink)
      .then(() => {
        CustomToast(dispatch, "Copied ✅");
        setDropDownId("");
      })
      .catch(() => {
        CustomToast(dispatch, "Copy Failed ✖️");
      });
  }

  return (
    <div key={video._id} onClick={navigateToVideoPage}>
      <div className="h-80 rounded-lg  hover:bg-gray-300 pt-3 px-2 hover:bg-opacity-20 hover:text-black">
        <div className="w-full h-[70%] ">
          <img
            src={video.thumbnail}
            alt="Thumbnail"
            className="w-full h-full object-cover rounded-lg"
            loading="lazy"
          />
        </div>
        <div className="flex w-full  mt-2 items-start relative">
          <div className=" h-9 min-w-9 max-w-9 rounded-full">
            <img
              src={avatar || "/src/assets/defaultAvatar.png"}
              alt=""
              className="object-cover w-full h-full rounded-full mt-1"
            />
          </div>
          <div className="px-2">
            <p className="text-white w-full  bg-slate-30  text-xl font-bold ">
              {video.title}
            </p>
            <p className="text-white ">{channelName}</p>
          </div>
          <img
            src="/src/assets/more.png"
            alt="More"
            onClick={(e) => {
              e.stopPropagation();
              setDropDownId(dropDownId === video._id ? "" : video._id);
            }}
            className="cursor-pointer w-5 h-5  absolute right-0 top-2 hover:w-6 hover:h-6 "
          />

          {/* dropDown */}
          {dropDownId === video._id && (
            <div className="absolute right-7 mt-2 z-10  divide-y divide-gray-100 rounded-lg shadow w-44 bg-black ">
              <ul className="py-2 text-sm  text-gray-200">
                {actions.includes("Basic") && (
                  <>
                    <li>
                      <button
                        onClick={(e) => {
                          copyLink(video?.videoURL);
                          e.stopPropagation();
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                      >
                        Copy Link
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setVideoId(video?._id);
                          setOpenPlayListCard(true);
                          setDropDownId("");
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                      >
                        Add to playlist
                      </button>
                    </li>
                  </>
                )}
                {actions.includes("ChannelCtrl") && (
                  <>
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVideo();
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                      >
                        Delete
                      </button>
                    </li>
                    <li>
                      <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditVideoId()
                        setShowForm();
                        setDropDownId("");
                      }}
                      className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white">
                        Edit
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoBox;

VideoBox.propTypes = {
  navigateToVideoPage: PropTypes.func,
  video: PropTypes.object,
  channelName: PropTypes.string,
  avatar: PropTypes.string,
  dropDownId: PropTypes.string,
  setDropDownId: PropTypes.func,
  setVideoId: PropTypes.func,
  setOpenPlayListCard: PropTypes.func,
  actions: PropTypes.array,
  deleteVideo: PropTypes.func,
  setShowForm: PropTypes.func,
  setEditVideoId: PropTypes.func,
};
