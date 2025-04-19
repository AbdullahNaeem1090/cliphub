import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import TryPlaylistBox from "../components/dummy";
import VideoSection from "../components/videoSection";
import PlaylistSideVideos from "../components/palylistSideVideos";

function WatchVideoPage() {
  const currVideo = useSelector((state) => state.currentVideo);
  const { _private: playlist } = useSelector((state) => state.playlist);
  const [openPlayListCard, setOpenplaylistCard] = useState(false);
  const [playlistVideos,setPlaylistVideos]=useState([])
  let isInPlaylist = playlist?.some((playlist) =>
    playlist?.videos.includes(currVideo._id)
  );

 
 

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currVideo.videoURL]);

  return (
    <div className=" md:p-2 sm:ml-56 scrollbar-custom ">
      <div className="p-3 rounded-lg mt-14 lg:flex overflow-clip w-full">
        <VideoSection
          currVideo={currVideo}
          setOpenplaylistCard={setOpenplaylistCard}
          isInPlaylist={isInPlaylist}
          playlistVideos={playlistVideos}
        />

        <PlaylistSideVideos setPlaylistVideos={setPlaylistVideos} />

        <TryPlaylistBox
          openPlayListCard={openPlayListCard}
          setOpenPlayListCard={setOpenplaylistCard}
          videoId={currVideo._id}
          playlist={playlist}
          createPlaylistOption={true}
        />
      </div>
    </div>
  );
}

export default WatchVideoPage;