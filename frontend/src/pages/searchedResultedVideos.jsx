import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setCurrentVideo } from "../slices/currentVideoSlice";
import VideoBox2 from "../components/videoBox2";
import { useAuth } from "../protection/useAuth";
import { useState } from "react";
import PlaylistBox from "../components/playListManagerBox";

function SearchResultVideosPage() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currUser } = useAuth();

  const [openPlayListCard, setOpenPlayListCard] = useState(false); //2
  const [videoId, setVideoId] = useState(""); //2
  const [dropDownId, setDropDownId] = useState(""); //2
  const { _private: playlist } = useSelector((state) => state.playlist);

  const result = useOutletContext();


  if (result.length < 1) {
    return (
      <div className="p-3 md:p-4 sm:ml-56">
        <div className="p-4 rounded-lg mt-14">
          <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-56">
            No Video Found For This Search
          </p>
        </div>
      </div>
    );
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

  return (
    <>
      <div className="p-3 md:p-4 sm:ml-56">
        <div className="p-1 rounded-lg mt-14">
          {result?.map((video) => (
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
              actions={["Basic"]}
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
    </>
  );
}
export default SearchResultVideosPage;
