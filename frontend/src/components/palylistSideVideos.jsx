import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentVideo } from "../slices/currentVideoSlice";
import { useAuth } from "../protection/useAuth";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import SidebarVideoCard from "./smallVideoBox";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

function PlaylistSideVideos({ setPlaylistVideos }) {
  const { playlistId } = useParams();
  const currVideo = useSelector((state) => state.currentVideo);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const { currUser } = useAuth();

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const resp = await axios.get(`/api/playlist/playlistVideos/${playlistId}`);
        const fetched = resp.data.data
        console.log(fetched)
        setVideos(fetched);
        setPlaylistVideos(fetched);
      } catch (err) {
        console.log("Failed to fetch playlist", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, setPlaylistVideos]);

  const changeVideo = async (videoId) => {
    try {
      const resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
    } catch (error) {
      console.log("Video change failed", error);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = videos.findIndex((v) => v._id === active.id);
      const newIndex = videos.findIndex((v) => v._id === over.id);
      const reordered = arrayMove(videos, oldIndex, newIndex);

      setVideos(reordered);
      setPlaylistVideos(reordered);

      try {
        const orderedIds = reordered.map((v) => v._id);
        await axios.put(`/api/playlist/reOrder/${playlistId}`, { orderedIds });
      } catch (error) {
        console.log("Reorder failed", error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex-1 rounded-lg lg:ml-2 lg:border-l lg:w-[30%]">
      <div className="hidden lg:block text-white font-extrabold text-2xl pl-3">
        Playlist Videos
      </div>
      <div className="lg:h-[1200px] lg:overflow-y-scroll scrollbar-hide lg:border-y mt-3 p-1">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={videos.map((v) => v._id)}
            strategy={verticalListSortingStrategy}
          >
            {videos.map((video) => (
              <SidebarVideoCard
                key={video._id}
                video={video}
                currVideoId={currVideo._id}
                changeVideo={changeVideo}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}

PlaylistSideVideos.propTypes = {
  setPlaylistVideos: PropTypes.func.isRequired,
};

export default PlaylistSideVideos;
