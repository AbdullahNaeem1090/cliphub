import { useState } from "react";
import { Trash2, Edit, Save, Plus, EyeOff, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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
import SortableVideoItem from "../../components/draggablePL_VideoBox";
import {
  _createPlaylist,
  changeCategory,
  removePlaylist,
  removeVideosFromPlaylist,
  renamePlaylist,
} from "../../slices/playlistSlice";

export default function PlaylistManager() {
  const { _public, _hidden } = useSelector((state) => state.playlist);
  const playlists = [..._public, ..._hidden];
  const [selectedPlaylistVideos, setSelectedPlaylistVideos] = useState([]);
  const sensors = useSensors(useSensor(PointerSensor));
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const dispatch = useDispatch();
  const [displayLeftBox, setDisplayLeft] = useState(false);

  const [selectedPlaylist, setSelectedPlaylist] = useState();
  const [displayInput, setDisplayInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState(
    selectedPlaylist?.name || ""
  );
  const [showConfirmDeletePlaylist, setShowConfirmDeletePlaylist] =
    useState(false);

  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const handleSelectPlaylist = async (playlist) => {
    setDisplayLeft(true);
    setCreatingPlaylist(false);
    setSelectedPlaylist(playlist);
    setNewPlaylistName(playlist.title);
    try {
      const resp = await axios.get(
        `/api/playlist/playlistVideos/${playlist._id}`
      );
      if (resp.data.success) {
        setSelectedPlaylistVideos(resp.data.data);
      }
      console.log(resp);
    } catch (error) {
      console.log(error);
    }

    setDisplayInput(false);
    setShowConfirmDeletePlaylist(false);
    setSelectAllChecked(false);
  };

  const DeletePlaylist = async () => {
    try {
      let resp = await axios.delete(
        `/api/playlist/deletePlaylist/${selectedPlaylist._id}`
      );
      if (resp.data.success) {
        dispatch(
          removePlaylist({
            playlistId: selectedPlaylist._id,
            category: selectedPlaylist.category,
          })
        );
        setSelectedPlaylist()
        setDisplayLeft(false)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSavePlaylistName = async () => {
    if (!newPlaylistName.trim()) return;

    let data = {
      playlistId: selectedPlaylist._id,
      newName: newPlaylistName,
      category: selectedPlaylist.category,
    };

    let resp = await axios.put("/api/playlist/reName", data);
    if (resp.data.success) {
      setDisplayInput(false);
      dispatch(renamePlaylist(data));
    }
    setDisplayInput(false);
    setSelectedPlaylist((prev) => ({ ...prev, title: newPlaylistName }));
  };

  const handleDeletePlaylist = () => {
    const remainingPlaylists = playlists.filter(
      (p) => p.id !== selectedPlaylist.id
    );
    // setPlaylists(remainingPlaylists);
    setSelectedPlaylist(remainingPlaylists[0] || null);
    setShowConfirmDeletePlaylist(false);
  };

  const handleVideoCheckboxChange = (videoId) => {
    const updatedVideos = selectedPlaylistVideos.map((v) =>
      v._id === videoId ? { ...v, selected: !v.selected } : v
    );
    setSelectedPlaylistVideos(updatedVideos);
  };

  const handleSelectAllChange = () => {
    const newSelectAllValue = !selectAllChecked;

    const updatedVideos = selectedPlaylistVideos.map((v) => ({
      ...v,
      selected: newSelectAllValue,
    }));

    setSelectedPlaylistVideos(updatedVideos);
    setSelectAllChecked(newSelectAllValue);
  };

  const handleCreatePlaylist = () => {
    setDisplayLeft(true);
    setDisplayInput(true);
    setCreatingPlaylist(true);
    setNewPlaylistName("");
    setSelectAllChecked(false);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = selectedPlaylistVideos.findIndex(
        (v) => v._id === active.id
      );
      const newIndex = selectedPlaylistVideos.findIndex(
        (v) => v._id === over.id
      );
      const reordered = arrayMove(selectedPlaylistVideos, oldIndex, newIndex);

      setSelectedPlaylistVideos(reordered);

      try {
        const orderedIds = reordered.map((v) => v._id);
        await axios.put(`/api/playlist/reOrder/${selectedPlaylist._id}`, {
          orderedIds,
        });
      } catch (error) {
        console.log("Reorder failed", error);
      }
    }
  };

  async function makeNewPlaylist() {
    if (!newPlaylistName) {
      setDisplayInput(false);
      return;
    }
    try {
      let resp = await axios.post("/api/playlist/createMyPlaylist", {
        title: newPlaylistName,
        category: "public",
      });

      if (resp.data.success) {
        dispatch(_createPlaylist(resp.data.data));
      }
      setSelectedPlaylist();
      setDisplayInput(false);
      setCreatingPlaylist(false);
      setDisplayLeft(false);
    } catch (error) {
      console.log(error);
    }
  }

  async function changePlaylistCategory(playlistId, oldCategory) {
    let newCategory = oldCategory === "hidden" ? "public" : "hidden";
    let resp = await axios.put("/api/playlist/changeCategory", { playlistId });
    if (resp.data.success) {
      let data = {
        playlistId,
        oldCategory,
        newCategory,
      };
      dispatch(changeCategory(data));
    }
  }

  async function removeVideos(deleteActive = false) {
    const selectedIds = selectedPlaylistVideos.reduce((acc, video) => {
      if (video.selected) {
        acc.push(video._id);
      }
      return acc;
    }, []);
    console.log(selectedIds);

    try {
      let resp = await axios.put("/api/playlist/removeMultipleVideos", {
        playlistId: selectedPlaylist._id,
        videoIds: selectedIds,
        active: deleteActive,
      });
      if (resp.data.success) {
        let data = {
          category: selectedPlaylist.category,
          playlistId: selectedPlaylist._id,
          videoIds: selectedIds,
        };
        dispatch(removeVideosFromPlaylist(data));
        setSelectedPlaylistVideos((prev) => {
          let filteredVideos = prev.filter((video) => !video.selected);
          return filteredVideos;
        });
        setSelectAllChecked(false);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 rounded-lg text-gray-200 p-8 flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex flex-wrap gap-6">
          {/* Middle column - Playlist Operations */}
          {displayLeftBox && (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex-1 min-w-[280px]">
              <div className="mb-6">
                {displayInput ? (
                  <div className="flex mb-4 gap-2">
                    <input
                      type="text"
                      className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-gray-100 focus:outline-none focus:border-blue-500"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      autoFocus
                    />
                    {creatingPlaylist ? (
                      <button
                        className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-2 text-white flex items-center justify-center"
                        onClick={makeNewPlaylist}
                      >
                        Create
                      </button>
                    ) : (
                      <button
                        className="bg-blue-600 hover:bg-blue-500 rounded px-3 py-2 text-white flex items-center justify-center"
                        onClick={handleSavePlaylistName}
                      >
                        <Save size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-gray-700 px-4 py-3 rounded-lg mb-4 text-lg font-medium flex justify-between items-center cursor-pointer">
                    <span>{selectedPlaylist?.title}</span>
                    <div
                      onClick={() => {
                        setCreatingPlaylist(false);
                        setDisplayInput(true);
                      }}
                    >
                      <Edit size={18} className="text-gray-400" />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {!creatingPlaylist && (
                  <>
                    <button
                      className="bg-gray-700 hover:bg-gray-600 w-full py-2 rounded-lg flex items-center justify-center"
                      onClick={() => {}}
                    >
                      Watch
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-500 w-full py-2 rounded-lg flex items-center justify-center"
                      onClick={DeletePlaylist}
                    >
                      Delete Playlist
                    </button>
                  </>
                )}
              </div>

              {showConfirmDeletePlaylist && (
                <div className="mt-4 border border-red-500 rounded-lg p-4 bg-gray-750">
                  <p className="text-sm mb-3">
                    Are you sure you want to delete this playlist?
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-gray-600 hover:bg-gray-500 py-2 rounded text-sm"
                      onClick={() => setShowConfirmDeletePlaylist(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex-1  py-2 rounded text-sm"
                      onClick={handleDeletePlaylist}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="flex-1 bg-red-800 hover:bg-red-700 py-2 rounded text-sm flex items-center justify-center gap-1">
                      <Trash2 size={14} />
                      Delete Videos Also
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right column - Other Playlists */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl flex-1 min-w-[280px] max-h-96 overflow-y-scroll scrollbar-hide">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                Your Playlists
              </h2>
              <button
                className="bg-blue-600 hover:bg-blue-500 p-1 rounded-full"
                onClick={handleCreatePlaylist}
              >
                <Plus size={20} />
              </button>
            </div>

            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className={`mb-3 border rounded-lg overflow-hidden ${
                  selectedPlaylist?._id === playlist._id
                    ? "border-blue-500 bg-gray-750"
                    : "border-gray-700 bg-gray-800"
                }`}
              >
                <div
                  className="p-3 hover:bg-gray-750 flex justify-between items-center"
                  onClick={() => handleSelectPlaylist(playlist)}
                >
                  <div>
                    <h3 className="font-medium">{playlist.title}</h3>
                    <p className="text-xs text-gray-400">
                      {playlist.videos.length} videos
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      changePlaylistCategory(playlist._id, playlist.category);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {playlist.category === "hidden" ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Bottom section - Selected Videos with Checkboxes and Reordering */}

        {selectedPlaylist && (
          <div className="mt-8 bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-100">
                Videos in {selectedPlaylist.title}
              </h2>

              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded bg-gray-700 border-gray-600"
                    checked={selectAllChecked}
                    onChange={handleSelectAllChange}
                  />
                  <span className="ml-2 text-sm text-gray-300">Select All</span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={selectedPlaylistVideos.map((v) => v._id)}
                  strategy={verticalListSortingStrategy}
                >
                  {selectedPlaylistVideos.map((video) => (
                    <SortableVideoItem
                      key={video._id}
                      video={video}
                      handleVideoCheckboxChange={handleVideoCheckboxChange}
                    />
                  ))}
                </SortableContext>
              </DndContext>

              {selectedPlaylistVideos.length === 0 && (
                <div className="text-center p-8 text-gray-500 italic">
                  No videos in this playlist
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete options */}
        {selectedPlaylistVideos.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-4 justify-center">
            <button
              className="bg-red-800 hover:bg-red-700 px-4 py-2 rounded-lg flex items-center gap-2"
              disabled={!selectedPlaylistVideos.some((v) => v.selected)}
              onClick={() => removeVideos()} // ensures no event object gets captured
            >
              <Trash2 size={16} />
              Remove Video
            </button>

            <button
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg flex items-center gap-2"
              disabled={!selectedPlaylist?.videos.some((v) => v.selected)}
            >
              Remove And Delete Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
