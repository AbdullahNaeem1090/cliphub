import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTempVideoArray } from "../../slices/myVideoSlice";
import { useNavigate } from "react-router-dom";
import { removeVideoFromHomePage } from "../../slices/allVideosSlice";
import { useAuth } from "../../protection/useAuth";
import { useQuery } from "@tanstack/react-query";
import PlaylistBox from "../../components/playListManagerBox";
import { remVideofromPlaylist } from "../../slices/playlistSlice";
import { setCurrentVideo } from "../../slices/currentVideoSlice";
import VideoBox from "../../components/videoBox";

function MyVideos() {
  const { currUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openPlayListCard, setOpenPlayListCard] = useState(false); //2
  const [videoId, setVideoId] = useState(""); //2
  const [dropDownId, setDropDownId] = useState(""); //2

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const playlists = useSelector((state) => state.playlist);
  const playlist = [...playlists._public, ...playlists._hidden];

  async function getMyVideos() {
    try {
      let resp = await axios.get(`/api/video/userVideos/${currUser._id}`);
      return resp.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: getMyVideos,
    refetchOnWindowFocus: false,
  });

  async function handleDelete(videoId) {
    try {
      console.log(videoId);
      let resp = await axios.delete(`/api/video/delVideo/${videoId}`);
      if (resp.data.success) {
        let tempVideoArray = data.filter((video) => {
          return video._id !== videoId;
        });
        dispatch(setTempVideoArray(tempVideoArray));
        dispatch(removeVideoFromHomePage(videoId));
        dispatch(
          remVideofromPlaylist({
            category: "both",
            videoId: videoId,
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  if (data.length < 1) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">
        No Video Uploaded
      </p>
    );
  }
  async function navigateToVideoPage(videoId, CurrUserId) {
    try {
      let resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${CurrUserId}`
      );
      dispatch(setCurrentVideo(resp.data.data));
      navigate("../wvp");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((video) => (
          <VideoBox
            key={video._id}
            navigateToVideoPage={() =>
              navigateToVideoPage(video._id, currUser._id)
            }
            video={video}
            channelName={currUser.username}
            avatar={currUser.avatar}
            dropDownId={dropDownId}
            setDropDownId={setDropDownId}
            setVideoId={setVideoId}
            setOpenPlayListCard={setOpenPlayListCard}
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
    </>
  );
}

export default MyVideos;
