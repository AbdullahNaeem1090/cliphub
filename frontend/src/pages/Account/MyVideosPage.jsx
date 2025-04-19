import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setTempVideoArray } from "../../slices/myVideoSlice";
import { useNavigate } from "react-router-dom";
import { removeVideoFromHomePage } from "../../slices/allVideosSlice";
import { useAuth } from "../../protection/useAuth";
import { useQuery } from "@tanstack/react-query";
import { navigateToVideoPage } from "../../utils/setCurrVideo&Navigate";
import TryPlaylistBox from "../../components/dummy";
import { remVideofromPlaylist } from "../../slices/playlistSlice";

function MyVideos() {
  const { currUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openPlayListCard, setOpenPlayListCard] = useState(false);//2
  const [videoId, setVideoId] = useState("");//2



  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const playlists = useSelector((state) => state.playlist);
  const playlist=[...playlists._public,...playlists._hidden]


  async function getMyVideos() {
    try {
      let resp = await axios.get("/api/video/myVideos");
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

  return (
    <>
      {data.map((video) => (
        <div key={video._id}>
          <div
            onClick={() =>
              navigateToVideoPage(video._id, currUser._id, dispatch, navigate)
            }
            className="flex flex-col max-h-90 md:max-h-56 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-opacity-20 p-1  bg-white bg-opacity-5 mb-2 md:p-2  my-2"
          >
            <img
              className="object-cover rounded-lg  h-52 md:min-w-80 md: md:rounded-lg"
              src={video.thumbnail ? video.thumbnail : "/src/assets/tn1.jpg"}
              alt="thunbnail"
            />
            <div className="flex md:w-full md:pl-3 j">
              <div className="md:hidden h-12 w-12 m-2 rounded-full ">
                <img
                  src={currUser.avatar || "/src/assets/defaultAvatar.png"}
                  alt="channel bgPic"
                  className="object cover w-full h-full rounded-full"
                />
              </div>
              <div className="flex items-center md:items-start justify-between pl-1 pt-1  leading-normal  w-full">
                <div>
                  <h5 className="mb-1 text-xl md:text-2xl font-bold tracking-tight text-slate-300  max-h-24  overflow-hidden">
                    {video.title}
                  </h5>
                  <div className="md:flex items-center">
                    <div className="hidden md:block h-8 w-8 m-2 rounded-full">
                      <img
                        src={currUser.avatar || "/src/assets/defaultAvatar.png"}
                        alt=""
                        className="object cover w-full h-full rounded-full"
                      />
                    </div>
                    <p className="mb-1 text-slate-300">{currUser.username}</p>
                  </div>
                </div>

                <div className="relative inline-block text-left">
                  {/* Dropdown button with image */}
                  <img
                    src="/src/assets/more.png"
                    alt="More"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDropdown(video._id);
                    }}
                    className="cursor-pointer w-8 h-8 "
                  />

                  {/* Dropdown menu */}
                  {openDropdownId === video._id && (
                    <div className="absolute right-0 mt-2 z-10  divide-y divide-gray-100 rounded-lg shadow w-44 bg-black bg-opacity-70">
                      <ul className="py-2 text-sm  text-gray-200">
                        <li>
                          <button
                            onClick={(e) => {
                              handleDelete(video._id);
                              e.stopPropagation();
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
                              setOpenPlayListCard(true);
                              setVideoId(video._id)
                            }}
                            className="block px-4 py-2 w-full text-left hover:bg-white hover:bg-opacity-5 hover:text-white"
                          >
                            Add to playlist
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}


<TryPlaylistBox openPlayListCard={openPlayListCard} setOpenPlayListCard={setOpenPlayListCard} videoId={videoId} playlist={playlist} createPlaylistOption={false}  />

    </>
  );
}

export default MyVideos;
