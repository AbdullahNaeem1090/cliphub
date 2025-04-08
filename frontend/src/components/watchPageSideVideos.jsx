import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { setCurrentVideo } from "../slices/currentVideoSlice";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../protection/useAuth";

function WatchPageSideVideos() {
  async function fetchHomePageVideos({ pageParam }) {
    if (!pageParam) pageParam = "";
    let response = await axios.get(`/api/video/getnewVideos/${pageParam}`);
    return response.data.data;
  }

  const { ref, inView } = useInView();
  const dispatch = useDispatch();
  const { currUser } = useAuth();
  const currVideo = useSelector((state) => state.currentVideo);

  const { data, hasNextPage, fetchNextPage } = useInfiniteQuery({
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

  let fetched = data?.pages.map((page) => page.data) || [];
  let fetchedVideos = fetched.flatMap((video) => video) || [];

  async function changeVideo(videoId) {
    try {
      let resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${currUser._id}`
      );
      dispatch(setCurrentVideo(resp.data.data));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex-1 rounded-lg lg:ml-2 lg:border-l lg:w-[30%] ">
      <div className="hidden lg:block text-white font-extrabold text-2xl pl-3 mb-2">
        Other Videos
      </div>
      <div className="lg:h-[1200px] lg:overflow-y-scroll scrollbar-hide lg:border-y ">
        {fetchedVideos.length &&
          fetchedVideos
            .filter((video) => video._id !== currVideo._id)
            .map((video) => (
              <div
                key={video._id}
                className="flex flex-col max-h-96 md:h-60 
                lg:h-36 text-white rounded-lg shadow md:flex-row md:w-full hover:bg-white hover:bg-opacity-10 p-1  mb-2 md:p-2 md:mb-0"
                onClick={() => changeVideo(video._id)}
              >
                <img
                  className="object-cover rounded-lg max-h-60 md:min-w-72 lg:min-w-44"
                  src={video.thumbnail}
                  alt=""
                />

                <div className="flex md:w-full md:pl-3">
                  <div className="md:hidden h-12 w-12 m-2 rounded-full ">
                    <img
                      src={video.thumbnail}
                      alt=""
                      className="object cover w-full h-full  rounded-full"
                    />
                  </div>
                  <div className="flex flex-col pl-1 pt-1  leading-normal md:w-full">
                    <h5 className="mb-1 text-xl  tracking-tight text-slate-200  max-h-36  overflow-hidden">
                      {video.title}
                    </h5>
                    <div className="md:flex items-center">
                      <div className="hidden md:block h-6 w-6 m-1 rounded-full">
                        <img
                          src={video.avatar || "/src/assets/defaultAvatar.png"}
                          alt=""
                          className="object cover w-full h-full rounded-full"
                        />
                      </div>
                      <p className="mb-1 text-slate-300 text-sm">
                        {video.username}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        {hasNextPage && (
          <div ref={ref} className="flex justify-center items-center my-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchPageSideVideos;
