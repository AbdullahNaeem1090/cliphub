import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurrentVideo,
  addToWatchHistory,
} from "../slices/currentVideoSlice";
import { useNavigate } from "react-router-dom";

function HomePage() {
  console.log("bodyrendered");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetchedVideos = useSelector((state) => state.allVideos.gatheredVideos);
  console.log(fetchedVideos);

  async function navigateToVideoPage(videoId) {
    let resp = await axios.get(`/api/video/playVideo/${videoId}`);
    dispatch(setCurrentVideo(resp.data.data));
    navigate("./wvp");
  }

  return (
    <div className="p-1 sm:ml-56">
      <div className="lg:p-4  rounded-lg mt-14">
        <div className="grid grid-cols-1  gap-4 mb-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {fetchedVideos.map((video) => (
            <div
              key={video._id}
              onClick={() => {
                navigateToVideoPage(video._id);
                dispatch(addToWatchHistory(video._id));
              }}
            >
              <div className="h-80 rounded-lg overflow-hidden hover:bg-gray-300 pt-3 px-2 hover:bg-opacity-20 hover:text-black">
                <div className="w-full h-[70%] ">
                  <img
                    src={video.thumbnail}
                    alt=""
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
                <div className="flex w-full  mt-2 items-start">
                  <div className=" h-9 min-w-9 max-w-9 rounded-full">
                    <img
                      src={video.avatar || "/src/assets/defaultAvatar.png"}
                      alt=""
                      className="object-cover w-full h-full rounded-full mt-1"
                    />
                  </div>
                  <div className="px-2">
                    <p className="text-white w-full  bg-slate-30  text-xl font-bold overflow-hidden">
                      {video.title}
                    </p>
                    <p className="text-white ">{video.username}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default HomePage;
