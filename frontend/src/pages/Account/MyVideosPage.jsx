import { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../protection/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PlaylistBox from "../../components/playListManagerBox";
import { setCurrentVideo } from "../../slices/currentVideoSlice";
import VideoBox from "../../components/videoBox";
import { CustomToast } from "../../utils/showUtils";
import EditForm from "../../components/editForm";

function MyVideos() {
  const queryClient = useQueryClient();
  const { currUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openPlayListCard, setOpenPlayListCard] = useState(false); //2
  const [videoId, setVideoId] = useState(""); //2
  const [editVideoId, setEditVideoId] = useState(""); //2
  const [dropDownId, setDropDownId] = useState(""); //2
  let [showForm, setShowForm] = useState(false);

  const playlists = useSelector((state) => state.playlist);
  const playlist = [...playlists._public, ...playlists._hidden];

  async function getMyVideos() {
    try {
      let resp = await axios.get(`/api/video/userVideos/${currUser._id}`);
      return resp.data.data;
    } catch (error) {
      console.log(error);
    }
  }

  const deleteItem = async (videoId) => {
    let resp = await axios.delete(`/api/video/delVideo/${videoId}`);
    return resp.data.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["userVideos"],
    queryFn: getMyVideos,
    refetchOnWindowFocus: false,
  });

  const { mutate } = useMutation({
    mutationFn: deleteItem,
    onMutate: async (videoId) => {
      await queryClient.cancelQueries(["userVideos"]);

      const previousVideos = queryClient.getQueryData(["userVideos"]);

      queryClient.setQueryData(["userVideos"], (old) =>
        old.filter((v) => v._id !== videoId)
      );
      CustomToast(dispatch, "Deleted");
      return { previousVideos };
    },
    onError: (err, videoId, context) => {
      queryClient.setQueryData(["userVideos"], context.previousVideos);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["userVideos"]);
    },
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong</p>;

  if (data.length < 1) {
    return (
      <p className="text-white fontStyle text-3xl pb-2 mb-2 text-center mt-20">
        No Video Uploaded
      </p>
    );
  }
  async function navigateToVideoPage(videoId, CurrUserId) {
    try {
      let resp = await axios.get(
        `/api/video/getPlayingVideoData/${videoId}/${CurrUserId}`
      );
      dispatch(setCurrentVideo(resp.data.data));
      navigate("../wvp");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {data.map((video) => (
          <VideoBox
            key={video._id}
            navigateToVideoPage={() =>navigateToVideoPage(video._id, currUser._id)}
            video={video}
            channelName={currUser.username}
            avatar={currUser.avatar}
            dropDownId={dropDownId}
            setDropDownId={setDropDownId}
            setVideoId={setVideoId}
            setOpenPlayListCard={setOpenPlayListCard}
            actions={["Basic", "ChannelCtrl"]}
            deleteVideo={() => mutate(video._id)}
            setShowForm={() => setShowForm(true)}
            setEditVideoId={() => setEditVideoId(video._id)}
          />
        ))}

        <PlaylistBox
          openPlayListCard={openPlayListCard}
          setOpenPlayListCard={setOpenPlayListCard}
          videoId={videoId}
          playlist={playlist}
          createPlaylistOption={false}
        />

        <EditForm
          showForm={showForm}
          setShowForm={setShowForm}
          editVideoId={editVideoId}
        />
      </div>
    </>
  );
}

export default MyVideos;
