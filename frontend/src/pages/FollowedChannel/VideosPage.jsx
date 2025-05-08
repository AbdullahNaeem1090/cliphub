import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setCurrentVideo } from "../../slices/currentVideoSlice";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useAuth } from "../../protection/useAuth";
import VideoBox from "../../components/videoBox";
import PlaylistBox from "../../components/playListManagerBox";
import { useState } from "react";

function SubscribedChannelVideos() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currUser } = useAuth();
  const { channelName, avatar, channelId } = useParams();
  const {_private:playlist} = useSelector((state) => state.playlist);
    const [videoId, setVideoId] = useState(""); //2
    const [openPlayListCard, setOpenPlayListCard] = useState(false); //2
    const [dropDownId, setDropDownId] = useState(""); //2
  

  async function getVideos() {
    let resp = await axios.get(`/api/video/userVideos/${channelId}`);
    return resp.data.data;
  }
  const { data, isLoading, error } = useQuery({
    queryKey: ["subscribedChannelVideos"],
    queryFn: getVideos,
    refetchOnWindowFocus: false,
  });

  const channelVideos = data || [];

  async function navigateToVideoPage(videoId) {
    try {
      let resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
      navigate("../wvp");
    } catch (error) {
      console.log(error);
    }
  }
  if (error) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">
        Error while Getting Videos
      </p>
    );
  }
  if (isLoading) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">
        Loading
      </p>
    );
  }
  if (data.length < 1) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">
        No Videos on this channel yet
      </p>
    );
  }

  return (
    <div className="lg:w-full lg:h-[600px] ">
      <p className="text-white text-3xl font-serif text-center bg-black bg-opacity-50 my-2 py-2 rounded-md lg:mt-0">
        Videos
      </p>
      <div className="lg:overflow-y-scroll max-h-[90%] scrollbar-hide">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {channelVideos.map((video) => (
            <VideoBox
              key={video._id}
              navigateToVideoPage={() =>
                navigateToVideoPage(video._id, currUser._id)
              }
              video={video}
              channelName={channelName}
              avatar={avatar}
              dropDownId={dropDownId}
              setDropDownId={setDropDownId}
              setVideoId={setVideoId}
              setOpenPlayListCard={setOpenPlayListCard}
              actions={["Basic"]}
            />
          ))}
          <PlaylistBox
            openPlayListCard={openPlayListCard}
            setOpenPlayListCard={setOpenPlayListCard}
            videoId={videoId}
            playlist={playlist}
            createPlaylistOption={false}
          />
        </div>
      </div>
    </div>
  );
}

export default SubscribedChannelVideos;
