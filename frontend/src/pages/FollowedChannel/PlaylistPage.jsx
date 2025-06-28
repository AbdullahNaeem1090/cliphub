import { useDispatch } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import PlaylistCard from "../../components/playlistCard";
import { useEffect, useState } from "react";
import { setCurrentVideo } from "../../slices/currentVideoSlice";
import { useAuth } from "../../protection/useAuth";
import { myAxios } from "../../utils/axiosInstance";

function SubscribedChannelPlaylists() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {currUser}=useAuth()
  const { channelId } = useParams();
  const [playListThumbnail, setPlaylistThumbnail] = useState({});
  const [playlists, setPlaylistVideos] = useState([]);



  async function getPlaylists() {
    try {
      let resp = await myAxios.get(`/api/playlist/getPlaylists/${channelId}`);
      let data=resp.data.data
      let pubicPlaylists = data?.filter((obj) => obj._id == "public");
      setPlaylistVideos(pubicPlaylists[0]?.docs||[])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getPlaylists()
  },[])

  async function getPlaylistThumbnail(playlistId) {
    try {
      let resp = await myAxios.get(`/api/playlist/getPLThumbnail/${playlistId}`);
      if (resp.data.success) {
        return resp.data.data;
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  useEffect(() => {
    if (!playlists.length) return;
    playlists.forEach((playlist) => {
      getPlaylistThumbnail(playlist._id).then((data) => {
        setPlaylistThumbnail((prev) => ({
          ...prev,
          [playlist._id]: data,
        }));
      });
    });
  }, [playlists]);

  async function navigateToVideoPage(playlistId) {
    let playlist= playlists.find((playlist)=>playlist._id==playlistId)
    let videoId=playlist?.videos[0]
     if(!videoId){
       return
     }
     try {
       let resp = await myAxios.get(`/api/video/getPlayingVideoData/${videoId}/${currUser._id}`);
       dispatch(setCurrentVideo(resp.data.data));
       navigate(`/main/watchPlaylist/${playlistId}/false`)
     } catch (error) {
       console.log(error);
     }
   }

  if (playlists.length < 1) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20 mx-auto">
        No Playlists on this channel yet
      </p>
    );
  }

  return (
    <>
      <div className="lg:w-full lg:max-h-[582px] ">
        <p className="text-white text-3xl font-serif text-center bg-black bg-opacity-50 my-2 py-2 rounded-md lg:mt-0">
          Playlists
        </p>
        <div className="lg:overflow-y-scroll lg:h-[515px] scrollbar-hide">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 lg:ml-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist?._id}
                playlist={playlist}
                onNavigate={() => navigateToVideoPage(playlist._id)}
                thumbnail={playListThumbnail[playlist?._id]}
                deleteControl={false}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
export default SubscribedChannelPlaylists;
