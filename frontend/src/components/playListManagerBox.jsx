import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";

import { CustomToast } from "../utils/showUtils";
import PropTypes from "prop-types";
import {
  _createPlaylist,
  addVideoToPlaylist,
  remVideofromPlaylist,
} from "../slices/playlistSlice";

function PlaylistBox({
  openPlayListCard,
  setOpenPlayListCard,
  videoId,
  playlist,
  createPlaylistOption,
}) {

  const [isPlaylistNameInpVisible, setIsPlaylistNameInpVisible] =
    useState(false);
  const dispatch = useDispatch();

  async function createPlaylist() {
    let playlistelement = document.getElementById("myInput");
    let playlistTitle = playlistelement.value;
    if (!playlistTitle) return;
    const firstvideoForPlaylist = {
      title: playlistTitle,
      playlistVideo: [videoId],
      category: "private",
    };
    try {
      let resp = await axios.post(
        "/api/playlist/createMyPlaylist",
        firstvideoForPlaylist
      );
      if (resp.data.status == 200) {
        dispatch(_createPlaylist(resp.data.data));
        playlistelement.value = "";
        setOpenPlayListCard(false);
        setIsPlaylistNameInpVisible(false);
        CustomToast(dispatch, `✅ Video Added In ${playlistTitle}`);
      }
    } catch (error) {
      console.log(error);
      CustomToast(dispatch, "✖️ Playlist Not created");
    }
  }

  async function updatePlaylist(add, playlistId, category, videoId) {
    try {
      let resp;
      if (add) {
        resp = await axios.post("/api/playlist/addVideoToPlaylist", {
          playlistId,
          videoId,
        });
        if (resp.data.success) {
          dispatch(
            addVideoToPlaylist({
              pList_Id: playlistId,
              videoId,
              category,
            })
          );
          CustomToast(dispatch, "Added");
        }
      } else {
        resp = await axios.patch(
          `/api/playlist/removeVideo/${videoId}/${playlistId}`
        );
        if (resp.data.success) {
          dispatch(
            remVideofromPlaylist({
              pList_Id: playlistId,
              videoId,
              category,
            })
          );
          CustomToast(dispatch, "Removed");
        }
      }
    } catch (error) {
      console.log(error);
      CustomToast(dispatch, "❌ Process Failed");
    }
  }

  function isPresentInPlaylist(playlistId) {
    let playList = playlist.filter((playlist) => playlist._id === playlistId);
    return playList[0].videos.includes(videoId);
  }

  return (
    <div
      className={
        openPlayListCard
          ? " fixed z-50 top-[45%] md:left-[50%] left-[23%]  w-52 text-sm font-medium  rounded-lg bg-black bg-opacity-90 border-gray-600"
          : "hidden"
      }
    >
      <div
        type="button"
        className="flex justify-between w-full px-4 py-2 font-xl text-left text-white rounded-t-lg cursor-pointer  bg-black bg-opacity-70"
      >
        Add Video to{" "}
        <button
          onClick={() => {
            setOpenPlayListCard(false);
            setIsPlaylistNameInpVisible(false);
          }}
        >
          <img src="/src/assets/close.png" className="h-5 w-5" alt="" />
        </button>
      </div>
      <ul>
        {playlist.length > 0 &&
          playlist.map((suggestion, index) => (
            <li key={suggestion._id} className="w-full">
              <label
                htmlFor={`checkbox-${index}`}
                className="flex items-center w-full px-2 py-2 gap-3 cursor-pointer hover:bg-white hover:bg-opacity-5"
              >
                <input
                  type="checkbox"
                  id={`checkbox-${index}`}
                  checked={isPresentInPlaylist(suggestion._id)}
                  className="w-5 h-5 rounded-md bg-gray-700 checked:bg-blue-500 checked:border-blue-500 border border-gray-500 appearance-none cursor-pointer transition-all duration-150"
                  onClick={(e) => {
                    e.stopPropagation(); // stops double toggling if needed
                    let isChecked = e.target.checked;
                    updatePlaylist(
                      isChecked,
                      suggestion._id,
                      suggestion.category,
                      videoId
                    );
                  }}
                />
                <span className="flex-1 text-gray-300 font-medium text-left">
                  {suggestion.title}
                </span>
              </label>
            </li>
          ))}
      </ul>
      {createPlaylistOption && (
        <>
          <button
            type="button"
            className="w-full flex justify-between px-4 py-2 font-medium text-left rtl:text-right  cursor-pointer text-gray-300 hover:bg-white hover:bg-opacity-5"
            onClick={() => setIsPlaylistNameInpVisible(true)}
          >
            Create Playlist{" "}
            <img src="/src/assets/add.png" className="h-5 w-5" alt="" />
          </button>
          <div
            className={isPlaylistNameInpVisible ? "flex flex-col " : "hidden"}
          >
            <input
              id="myInput"
              type="text"
              placeholder="Playlist Name"
              className="m-2 p-1 w-auto border rounded-lg text-white bg-gray-800 border-gray-600 focus:outline-none "
            />

            <button
              onClick={createPlaylist}
              className="mx-2 my-2 px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </>
      )}
    </div>
  );
}

PlaylistBox.propTypes = {
  openPlayListCard: PropTypes.bool,
  setOpenPlayListCard: PropTypes.func,
  videoId: PropTypes.string,
  playlist: PropTypes.array,
  createPlaylistOption: PropTypes.bool,
};

export default PlaylistBox;
