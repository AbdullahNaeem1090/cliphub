import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  addToWatchHistory,
  setCurrentVideo,
} from "../../slices/currentVideoSlice";
import { setPlaylistVideos } from "../../slices/playistVideosSlice";
import { deletePlaylist } from "../../slices/playlistSlice";
import { useEffect, useMemo, useState } from "react";
import PlaylistCard from "../../components/playlistCard";
import AddPlaylistCard from "../../components/addPlaylistButton";
import PlaylistInputCard from "../../components/createPlaylistCard";

function MyPlaylist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showCard, setShowCard] = useState(false);

  const { _public, _hidden } = useSelector((state) => state.playlist);

  const playlists = useMemo(() => [..._public, ..._hidden], [_public, _hidden]);

  async function navigateToVideoPage(index) {
    let videoId = playlists[index].videos[0];
    try {
      let resp = await axios.get(`/api/video/playVideo/${videoId}`);
      let resp1 = await axios.get(
        `/api/playlist/playlistVideos/${playlists[index]._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
      dispatch(addToWatchHistory(resp.data.data._id));
      dispatch(setPlaylistVideos(resp1.data.data));
      navigate("../../playlist");
    } catch (error) {
      console.log(error);
    }
  }
  async function DeletePlaylist(id) {
    try {
      let resp = await axios.delete(`/api/playlist/deletePlaylist/${id}`);
      if (resp) {
        dispatch(deletePlaylist({ id: id, category: "public" }));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const [playListThumbnail, setPlaylistThumbnail] = useState({});

  async function getPlaylistThumbnail(playlistId) {
    try {
      let resp = await axios.get(`/api/playlist/getPLThumbnail/${playlistId}`);
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
    return (<>
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">
        No Playlists Yet
      </p>
        <AddPlaylistCard openCard={() => setShowCard(true)} />
        {showCard && <PlaylistInputCard onClose={() => setShowCard(false)} />} 
        </>
    );
  }

  return (
    <>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4 lg:ml-3">
        {playlists.map((playlist, index) => (
          <PlaylistCard
            key={playlist._id}
            playlist={playlist}
            onNavigate={() => navigateToVideoPage(index)}
            onDelete={() => DeletePlaylist(playlist._id)}
            thumbnail={playListThumbnail[playlist._id]}
          />
        ))}

        <AddPlaylistCard openCard={() => setShowCard(true)} />

        {showCard && <PlaylistInputCard onClose={() => setShowCard(false)} />}
      </div>
    </>
  );
}

export default MyPlaylist;
