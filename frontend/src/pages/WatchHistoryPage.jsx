import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo } from "../slices/currentVideoSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../protection/useAuth";
import VideoBox2 from "../components/videoBox2";
import PlaylistBox from "../components/playListManagerBox";

function WatchHistory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [history, setHistory] = useState([]);
  const { currUser } = useAuth();
  const [openPlayListCard, setOpenPlayListCard] = useState(false); //2
  const [videoId, setVideoId] = useState(""); //2
  const [dropDownId, setDropDownId] = useState(""); //2
  const { _private: playlist } = useSelector((state) => state.playlist);
  console.log(playlist);

  async function removeFromHistory(id) {
    console.log(id);
    let resp = await axios.delete(
      `/api/watchHistory/deleteVideoFromHistory/${id}`
    );
    if (resp.data.success) {
      setHistory((prev) => prev.filter((video) => video._id !== id));
    }
  }
  async function clearHistory() {
    let resp = await axios.delete(`/api/watchHistory/clear/${currUser._id}`);
    if (resp.data.success) {
      setHistory([]);
    }
  }

  async function navigateToVideoPage(videoId) {
    let resp = await axios.get(
      `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
    );
    if (resp) {
      dispatch(setCurrentVideo(resp.data.data));
      navigate("../wvp");
    }
  }

  async function getWatchHistory() {
    let resp = await axios.get(`/api/watchHistory/getHistory/${currUser._id}`);
    if (resp.data.success) {
      setHistory(resp.data.data);
    }
  }

  useEffect(() => {
    getWatchHistory();
  }, []);

  if (history.length < 1) {
    return (
      <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
        <div className="p-3 rounded-lg mt-14 overflow-clip">
          <p className="text-white fontStyle text-4xl pb-2 mb-2 text-center mt-56">
            No Video In Watch History
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-1 md:p-2 sm:ml-56 scrollbar-custom ">
      <div className="p-1 rounded-lg mt-14 ">
        <header className="flex justify-between text-white mb-3">
          <p className="lg:text-3xl text-2xl fontStyle font-bold">
            Watch History
          </p>
          <button
            onClick={clearHistory}
            className="bg-red-600 px-1 rounded-lg font-semibold text-sm hover:bg-red-700"
          >
            Clear Watch History
          </button>
        </header>

        {history.map((video) => (
          <VideoBox2
            key={video._id}
            navigateToVideoPage={() =>
              navigateToVideoPage(video.videoId, currUser._id)
            }
            video={video}
            channelName={video.username}
            avatar={video.avatar}
            dropDownId={dropDownId}
            setDropDownId={setDropDownId}
            setVideoId={setVideoId}
            setOpenPlayListCard={setOpenPlayListCard}
            removeFromHistory={removeFromHistory}
            actions={["Basic","History"]}
          />
        ))}
      </div>
      <PlaylistBox
        openPlayListCard={openPlayListCard}
        setOpenPlayListCard={setOpenPlayListCard}
        videoId={videoId}
        playlist={playlist}
        createPlaylistOption={true}
      />
    </div>
  );
}

export default WatchHistory;
