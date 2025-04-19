import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { setCurrentVideo } from "../slices/currentVideoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../protection/useAuth";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

function PlaylistSideVideos({setPlaylistVideos}) {

  const { playlistId } = useParams();
  const currVideo = useSelector((state) => state.currentVideo);

  async function getPlaylistVideos() {
    try {
      let resp = await axios.get(`/api/playlist/playlistVideos/${playlistId}`);
      return resp.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  const { data, isLoading,error } = useQuery({
    queryKey: ["sidePlaylistVideos"],
    queryFn: getPlaylistVideos,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setPlaylistVideos(data.playlistVideos);
    }
  }, [data,setPlaylistVideos]);

  let fetchedVideos = data?.playlistVideos||[]


  const dispatch = useDispatch();
  const { currUser } = useAuth();

  async function changeVideo(videoId) {
    try {
      let resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
    } catch (error) {
      console.log(error);
    }
  }

  if (isLoading) {
    return <p>Loading</p>;
  }
  if (error) {
    return <p>Loading</p>;
  }

  return (
    <div className="flex-1 rounded-lg lg:ml-2 lg:border-l lg:w-[30%]  ">
      <div className="hidden lg:block text-white font-extrabold text-2xl pl-3">
        Playlist Videos
      </div>
      <div className="lg:h-[1200px] lg:overflow-y-scroll scrollbar-hide lg:border-y mt-3 p-1 ">
        {fetchedVideos.length &&
          fetchedVideos.map((video) => (
            
            <div
              key={video._id}
              className={`flex flex-col max-h-96 md:h-60 lg:h-36 text-white rounded-lg shadow 
                md:flex-row md:w-[97%] hover:bg-white hover:bg-opacity-10 
                p-1 mb-2 mx-1 md:mb-0 
                ${currVideo._id === video._id ? "ring-2 ring-blue-500" : ""}`
              }
              
              onClick={() => changeVideo(video._id)}
            >
              <img
                className="object-cover rounded-lg max-h-60 md:min-w-72 lg:min-w-44"
                src={video.thumbnail}
                alt=""
              />

              <div className="flex md:w-full md:pl-3">
                <div className="md:hidden h-12 w-12 m-2 rounded-full ">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="object cover w-full h-full  rounded-full"
                  />
                </div>
                <div className="flex flex-col pl- pt-1  leading-normal md:w-full">
                  <p className="mb-1 text-md  tracking-tight text-slate-200  max-h-36  overflow-hidden">
                    {video.title}
                  </p>
                  <div className="md:flex items-center">
                    <div className="hidden md:block h-6 w-6 m-1 rounded-full">
                      <img
                        src={video.avatar || "/src/assets/defaultAvatar.png"}
                        alt=""
                        className="object cover w-full h-full rounded-full"
                      />
                    </div>
                    <p className="mb-1 text-slate-300 text-sm">
                      {video.username}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

PlaylistSideVideos.propTypes = {
  setPlaylistVideos: PropTypes.func,
};

export default PlaylistSideVideos;
