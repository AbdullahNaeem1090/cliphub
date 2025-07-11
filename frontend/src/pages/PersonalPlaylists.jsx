import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";
import { setCurrentVideo } from "../slices/currentVideoSlice";
// import { deletePlaylist } from "../slices/playlistSlice";
import { useEffect, useMemo, useState } from "react";
import PlaylistCard from "../components/playlistCard";
import { useAuth } from "../protection/useAuth";
import { removePlaylist } from "../slices/playlistSlice";
import { myAxios } from "../utils/axiosInstance";

function MyPlaylist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currUser } = useAuth();

  const { _private } = useSelector((state) => state.playlist);

  const playlists = useMemo(() => [..._private], [_private]);

  async function navigateToVideoPage(playlistId) {
    let playlist = playlists.find((playlist) => playlist._id == playlistId);
    let videoId = playlist?.videos[0];
    console.log(playlist, videoId);
    if (!videoId) {
      return;
    }
    try {
      let resp = await myAxios.get(
        `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
      navigate(`/main/watchPlaylist/${playlistId}/true`);
    } catch (error) {
      console.log(error);
    }
  }
  const DeletePlaylist = async (id) => {
    try {
      let resp = await myAxios.delete(`/api/playlist/deletePlaylist/${id}`);
      if (resp.data.success) {
        dispatch(
          removePlaylist({
            playlistId: id,
            category: "private",
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const [playListThumbnail, setPlaylistThumbnail] = useState({});

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

  if (playlists.length < 1) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">
        No Playlists Yet
      </p>
    );
  }

  return (
    <>
      <div className="p-3 md:p-4 sm:ml-56 scrollbar-custom">
        <div className="p-3 rounded-lg mt-14 overflow-clip">
          <p className="text-white font-serif text-3xl border-b inline-block pb-2 mb-4">
            Your Playlists
          </p>

          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 lg:ml-3">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist?._id}
                playlist={playlist}
                onNavigate={() => navigateToVideoPage(playlist._id)}
                onDelete={() => DeletePlaylist(playlist?._id)}
                thumbnail={playListThumbnail[playlist?._id]}
                deleteControl={true}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MyPlaylist;
