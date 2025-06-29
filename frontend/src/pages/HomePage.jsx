
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../protection/useAuth";
import { navigateToVideoPage } from "../utils/setCurrVideo&Navigate";
import VideoBox from "../components/videoBox";
import PlaylistBox from "../components/playListManagerBox";
import { myAxios } from "../utils/axiosInstance";


async function fetchHomePageVideos({ pageParam }) {
  if (!pageParam) pageParam = "";
  let response = await myAxios.get(`/api/video/getnewVideos/${pageParam}`);
  return response.data.data;
}

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const { currUser } = useAuth();
  const { _private: playlist } = useSelector((state) => state.playlist);

  let [dropDownId, setDropDownId] = useState("");
  let [openPlayListCard, setOpenPlayListCard] = useState(false);
  let [videoId, setVideoId] = useState("");


  const { data, status, error, hasNextPage, fetchNextPage } = useInfiniteQuery({
    queryKey: ["homePageVideos"],
    queryFn: fetchHomePageVideos,
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? null,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  let fetched = data?.pages.map((page) => page.data);

  if (status === "pending") {
    return (
      <div className="sm:ml-56 mt-[20%] flex justify-center items-center my-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="sm:ml-56 mt-[20%] flex justify-center items-center my-4">
        <div className="h-8 w-8  rounded-full border-4 border-blue-500 border-t-transparent">
          {error.message}
        </div>
      </div>
    );
  }

  let fetchedVideos = fetched.flatMap((video) => video) || [];

  return (
    <div className="p-1 sm:ml-56">
      <div className="lg:p-4  rounded-lg mt-14">
        <div className="grid grid-cols-1  gap-4 mb-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {fetchedVideos.map((video) => (
            <VideoBox
              key={video._id}
              navigateToVideoPage={() =>
                navigateToVideoPage(video._id, currUser._id, dispatch, navigate)
              }
              video={video}
              channelName={video.username}
              avatar={video.avatar}
              dropDownId={dropDownId}
              setDropDownId={setDropDownId}
              setVideoId={setVideoId}
              setOpenPlayListCard={setOpenPlayListCard}
              actions={["Basic"]}

            />
          ))}
        </div>
        {hasNextPage && fetchedVideos.length > 0 && (
          <div ref={ref} className="flex justify-center items-center my-4">
            -
          </div>
        )}

      </div>
      <PlaylistBox
        openPlayListCard={openPlayListCard}
        setOpenPlayListCard={setOpenPlayListCard}
        videoId={videoId}
        playlist={playlist}
        createPlaylistOption={true}
      />
    </div>
  );
}
export default HomePage;
