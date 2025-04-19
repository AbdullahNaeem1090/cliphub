import axios from "axios";
import { useDispatch } from "react-redux";
import {
  addToWatchHistory,
} from "../slices/currentVideoSlice";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useAuth } from "../protection/useAuth";
import { navigateToVideoPage } from "../utils/setCurrVideo&Navigate";

async function fetchHomePageVideos({ pageParam }) {
  if (!pageParam) pageParam = "";
  let response = await axios.get(`/api/video/getnewVideos/${pageParam}`);
  return response.data.data;
}

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ref, inView } = useInView();
  const {currUser}=useAuth()
  

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent">
          {error.message}
        </div>
      </div>
    );
  }

  let fetchedVideos = fetched.flatMap((video) => video)||[];

  return (
    <div className="p-1 sm:ml-56">
      <div className="lg:p-4  rounded-lg mt-14">
        <div className="grid grid-cols-1  gap-4 mb-4 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {fetchedVideos.map((video) => (
            <div
              key={video._id}
              onClick={() => {
                navigateToVideoPage(video._id,currUser._id,dispatch,navigate);
                dispatch(addToWatchHistory(video._id));
              }}
            >
              <div className="h-80 rounded-lg overflow-hidden hover:bg-gray-300 pt-3 px-2 hover:bg-opacity-20 hover:text-black">
                <div className="w-full h-[70%] ">
                  <img
                    src={video.thumbnail}
                    alt="Thumbnail"
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
        {hasNextPage && (
          <div ref={ref} className="flex justify-center items-center my-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}
export default HomePage;
