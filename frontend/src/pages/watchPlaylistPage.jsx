import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import PlaylistBox from "../components/playListManagerBox";
import VideoSection from "../components/videoSection";
import PlaylistSideVideos from "../components/palylistSideVideos";
import axios from "axios";
import { useAuth } from "../protection/useAuth";

function WatchVideoPage() {
  const currVideo = useSelector((state) => state.currentVideo);
  const {currUser}=useAuth()
  const { _private: playlist } = useSelector((state) => state.playlist);
  const [openPlayListCard, setOpenplaylistCard] = useState(false);
  const [playlistVideos,setPlaylistVideos]=useState([])
  let isInPlaylist = playlist?.some((playlist) =>
    playlist?.videos.includes(currVideo._id)
  );

  async function addVideoToWatchHistory(){
    try {
      await axios.post("/api/watchHistory/addVideoToWatchHistory",{
        userId:currUser._id,
        videoId:currVideo._id
      })
    } catch (error) {
      console.log(error)
    }
    
   }
  
    useEffect(() => {
      if (!currVideo?._id) return;
  
      const timer = setTimeout(() => {
        addVideoToWatchHistory()
      }, 3000); 
  
      return () => clearTimeout(timer); 
    }, [currVideo]);

 
 

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

        <PlaylistBox
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