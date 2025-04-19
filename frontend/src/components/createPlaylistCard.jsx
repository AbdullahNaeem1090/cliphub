import { useState } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import axios from "axios";
import { _createPlaylist } from "../slices/playlistSlice";

function PlaylistInputCard({ onClose }) {
  const [playlistName, setPlaylistName] = useState("");
  const dispatch = useDispatch();

  async function makeNewPlaylist() {
    try {
      let resp=await axios.post("/api/playlist/createMyPlaylist",{title:playlistName,category:"public"})

      console.log(resp.data.data)
      if(resp.data.success){
        dispatch(_createPlaylist(resp.data.data))
      }
      onClose()
    } catch (error) {
      console.log(error);
    }
 }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-gray-900 text-white rounded-2xl shadow-xl p-6 w-80 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl hover:text-red-400"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4 text-center">New Playlist</h2>

        <input
          type="text"
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={()=>makeNewPlaylist()}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
}

PlaylistInputCard.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default PlaylistInputCard;
