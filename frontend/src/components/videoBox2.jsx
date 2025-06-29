import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { CustomToast } from "../utils/showUtils";

function VideoBox2({
  navigateToVideoPage,
  video,
  channelName,
  avatar,
  dropDownId,
  setDropDownId,
  setVideoId,
  setOpenPlayListCard,
  removeFromHistory,
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
    <div
      className="flex flex-col max-h-96 md:min-h-60 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20  bg-white bg-opacity-0 p-1  mb-2 md:p-2 md:mb-0"
      onClick={navigateToVideoPage}
    >
      <img
        className="object-cover rounded-lg h-52 md:min-w-80 md: md:rounded-lg"
        src={video.thumbnail}
        alt=""
      />

      <div className="flex md:w-full md:pl-3 relative">
        <div className="md:hidden h-12 w-12 m-2 rounded-full ">
          <img
            src={avatar || "/icon/defaultAvatar.png"}
            alt=""
            className="object cover w-full h-full rounded-full"
          />
        </div>
        <div className="flex flex-col pl-1 pt-1  leading-normal md:w-full">
          <h5 className="mb-1 text-2xl font-bold tracking-tight text-slate-200  max-h-24  overflow-hidden">
            {video.title}
          </h5>
          <div className="md:flex items-center">
            <div className="hidden md:block h-6 max-w-6 m-2 rounded-full">
              <img
                src={avatar || "/icon/defaultAvatar.png"}
                alt=""
                className="object cover w-full h-full rounded-full"
              />
            </div>
            <p className="mb-1 text-slate-300">{channelName}</p>
            <img
              src="/icon/more.png"
              alt="More"
              onClick={(e) => {
                e.stopPropagation();
                setDropDownId(dropDownId === video._id ? "" : video._id);
              }}
              className="cursor-pointer w-5 h-5  absolute right-0 top-2 hover:w-6 hover:h-6 "
            />

            {/* drop down */}

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
                            setVideoId(video?.videoId||video?._id);
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
                        <button className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white">
                          Delete
                        </button>
                      </li>
                      <li>
                        <button className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white">
                          Edit
                        </button>
                      </li>
                    </>
                  )}
                  {actions.includes("History") && (
                    <li>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromHistory(video._id);
                        }}
                        className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                      >
                        Remove from History
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoBox2;
VideoBox2.propTypes = {
  navigateToVideoPage: PropTypes.func,
  video: PropTypes.object,
  channelName: PropTypes.string,
  avatar: PropTypes.string,
  dropDownId: PropTypes.string,
  setDropDownId: PropTypes.func,
  setVideoId: PropTypes.func,
  setOpenPlayListCard: PropTypes.func,
  removeFromHistory: PropTypes.func,
  actions: PropTypes.array,
};
