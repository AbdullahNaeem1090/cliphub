import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  addLike,
  removeLike,
  unSubscribe_slice,
  addSubscribe,
} from "../slices/currentVideoSlice";
import axios from "axios";
import { useAuth } from "../protection/useAuth";
import { CustomToast } from "../utils/showUtils";
import Comments from "../components/comments";
import WatchPageSideVideos from "../components/watchPageSideVideos";
import PlaylistBox from "../components/playlistBox";

function WatchVideoPage() {
  const currVideo = useSelector((state) => state.currentVideo);
  const { currUser } = useAuth();
  const [description, setdescription] = useState(false);
  const [openPlayListCard, setOpenplaylistCard] = useState(false);

  let isInPlaylist = currVideo?.playListInfo?.some((playlist) =>
    playlist.videos.includes(currVideo._id)
  );

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currVideo.videoURL]);

  async function subscribe() {
    let resp = await axios.post("/api/subscription/subscribe", {
      subscriber: currUser._id,
      subscribedTo: currVideo.VideoCreator._id,
    });
    if (resp.data.success) {
      dispatch(addSubscribe());
      CustomToast(dispatch, "✅ Subscribed");
    }
  }

  async function unSubscribe() {
    let resp = await axios.post("/api/subscription/unSubscribe", {
      subscriber: currUser._id,
      subscribedTo: currVideo.VideoCreator._id,
    });
    if (resp.data.success) {
      dispatch(unSubscribe_slice());
      CustomToast(dispatch, "✅ Un Subscribed");
    }
  }

  async function handleLike(userId, videoId, doLike) {
    let resp;
    try {
      if (!doLike) {
        resp = await axios.post(`/api/like/addLike`, {
          videoId: videoId,
          userId: userId,
        });
        if (resp.data.success) {
          dispatch(addLike());
        }
      } else {
        console.log("called 2");

        resp = await axios.post(`/api/like/removeLike`, {
          videoId: videoId,
          userId: userId,
        });
        if (resp.data.success) {
          dispatch(removeLike());
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className=" md:p-2 sm:ml-56 scrollbar-custom ">
        <div className="p-3 rounded-lg mt-14 lg:flex overflow-clip w-full">
          <div className="lg:w-[70%]">
            <div className="mb-4 lg:w-full ">
              <div className=" overflow-hidden ">
                <video
                  src={currVideo?.videoURL}
                  controls
                  autoPlay
                  className="rounded-xl border-black object-cover lg:w-full min-h-[320px]  max-h-[480px]"
                ></video>
              </div>
              <div>
                <p className="text-white text-2xl font-bold py-2">
                  {currVideo?.title}
                </p>
                <div className="flex justify-between lg:max-w-[845px] ">
                  <div className="flex items-center">
                    <div>
                      <img
                        src={
                          currVideo?.VideoCreator?.avatar ||
                          "/src/assets/defaultAvatar.png"
                        }
                        className="object-cover h-11 w-12 rounded-full"
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col ml-2">
                      <p className="text-white font-bold">
                        {currVideo?.VideoCreator?.username}
                      </p>
                      <p className="text-gray-100 text-sm">
                        {currVideo.subscribersCount} Subscribers
                      </p>
                    </div>
                  </div>
                  <div className="flex lg:space-x-6 space-x-2">
                    <button
                      className="flex flex-col items-center"
                      onClick={() => setOpenplaylistCard(true)}
                    >
                      <img
                        src={`/src/assets/${
                          isInPlaylist ? "saved" : "save"
                        }.png`}
                        alt=""
                        className="md:h-8 md:w-8 h-6 w-6"
                      />
                      <p className="text-white text-sm">
                        {isInPlaylist ? "Saved" : "Save"}
                      </p>
                    </button>

                    <button
                      onClick={() =>
                        handleLike(
                          currUser._id,
                          currVideo._id,
                          currVideo.isLikedByCurrentUser
                        )
                      }
                    >
                      <img
                        src={`/src/assets/${
                          currVideo.isLikedByCurrentUser ? "liked" : "like"
                        }.png`}
                        alt="like Picture"
                        className="md:h-8 md:w-8 h-6 w-6"
                      />
                      <p className="text-white">{currVideo.likesCount}</p>
                    </button>

                    <button
                      onClick={
                        currVideo.hasSubscribed ? unSubscribe : subscribe
                      }
                      className={`text-white rounded-full px-2 h-10 md:font-bold
                        ${
                          currVideo.hasSubscribed
                            ? "bg-gray-600 ml-5 hover:bg-slate-500"
                            : "bg-red-600 ml-5 hover:bg-red-700"
                        }`}
                    >
                      {currVideo.hasSubscribed ? "Subcribed" : "Subscribe"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-950 h-auto p-4 rounded-lg lg:max-w-[845px] mb-2">
              <div className="flex justify-between">
                <p className="text-white font-bold text-2xl">Description</p>
                <img
                  src="/src/assets/logout.png"
                  className="h-7 w-7 cursor-pointer"
                  onClick={() => setdescription((prev) => !prev)}
                  alt=""
                />
              </div>
              {description && (
                <p className="text-white ml-5 mt-2 text-xl">
                  {currVideo.description}
                </p>
              )}
            </div>

            {/* //section area comments */}

            <Comments />
          </div>

          <WatchPageSideVideos />
        </div>
      </div>
      <PlaylistBox openPlayListCard={openPlayListCard} setOpenPlayListCard={setOpenplaylistCard}/>
    </>
  );
}

export default WatchVideoPage;
