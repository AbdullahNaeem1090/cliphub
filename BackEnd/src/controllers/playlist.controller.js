import { asyncHandler } from "../utils/asyncHandler.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { videoModel } from "../models/video.model.js";
import { playlistModel } from "../models/playlist.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const createPlaylist = asyncHandler(async (req, res) => {
  const { title, playlistVideo, category } = req.body;
  if ([title, category].some((field) => field == "")) {
    res.status(400).json({ error: "A field is missing" });
  }
  let video = [];
  if (playlistVideo) {
    video = [playlistVideo];
  }

  const createdPlaylist = await playlistModel.create({
    owner: req.user._id,
    title: title,
    videos: video,
    category: category,
  });

  if (!createdPlaylist) {
    res.status(500).json({ error: "Server Side error" });
  }

  return res.json(
    new ApiResponse(200, createdPlaylist, "playlist created", true)
  );
});

const getPlaylists = asyncHandler(async (req, res) => {
  let { userId } = req.params;
  if (!userId) {
    return res.status(400).json({ message: "id missing" });
  }
  const myPlaylists = await playlistModel.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$category",
        docs: { $push: "$$ROOT" },
      },
    },
  ]);
  return res.json(new ApiResponse(200, myPlaylists, "playlist fetcted", true));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.body;

  if (!playlistId || !videoId) {
    return res.status(400).json({ error: "A field is missing" });
  }

  const updatedPlaylist = await playlistModel.updateOne(
    { _id: playlistId },
    {
      $push: { videos: videoId },
    }
  );

  if (!updatedPlaylist) {
    return res.status(400).json({ error: "server Error" });
  }

  return res.json(new ApiResponse(200, {}._id, "video added", true));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;
  if (!videoId || !playlistId) {
    return res.status(400).json({ error: "ID missing" });
  }

  const updatedPlaylist = await playlistModel.findOneAndUpdate(
    { _id: playlistId },
    { $pull: { videos: videoId } }
  );

  if (!updatedPlaylist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  return res.json(
    new ApiResponse(200, {}, "Video removed from playlist", true)
  );
});

const getPlaylistVideos = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    res.status(400).json({ error: "id is missing" });
  }
  const playlistVideos = await playlistModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(playlistId),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos",
        foreignField: "_id",
        as: "playlistVideos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "creator",
              pipeline: [
                {
                  $project: {
                    avatar: 1,
                    username: 1,
                  },
                },
              ],
            },
          },
          {
            $unwind: "$creator",
          },
          {
            $project: {
              _id: 1,
              title: 1,
              thumbnail: 1,
              avatar: "$creator.avatar",
              username: "$creator.username",
            },
          },
        ],
      },
    },
    {
      $project: {
        _id: 1,
        videos: 1,
        playlistVideos: 1,
      },
    },
  ]);

  const ordered = playlistVideos[0].videos.map((id) =>
    playlistVideos[0].playlistVideos.find(
      (video) => video._id.toString() === id.toString()
    )
  );

  res.json(new ApiResponse(200, ordered, "playlist videos sent", true));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!playlistId) {
    return res.json({ error: "id not provided" });
  }

  const removingPlaylistId = await videoModel.updateMany(
    {
      playListMember: playlistId,
    },
    {
      $pull: { playListMember: playlistId },
    }
  );
  const deletingPlaylist = await playlistModel.findByIdAndDelete({
    _id: playlistId,
  });

  return res.json(
    new ApiResponse(200, { removingPlaylistId, deletingPlaylist }, "deleted")
  );
});

const getPLThumbnail = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  const playlist = await playlistModel.findById(playlistId).populate({
    path: "videos",
    select: "thumbnail",
    options: { limit: 1 },
  });

  if (playlist.videos.length === 0) {
    return res.json({ success: false, message: "No videos found" });
  }

  const firstThumbnail = playlist.videos[0].thumbnail;

  return res.json(
    new ApiResponse(200, firstThumbnail, "fethced the thumbnal", true)
  );
});

const reOrderVideos = async (req, res) => {
  const { orderedIds } = req.body;
  const { id } = req.params;

  try {
    const updatedPlaylist = await playlistModel.findByIdAndUpdate(
      id,
      { videos: orderedIds },
      { new: true }
    );


    res.status(200).json({ message: "Playlist order updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to reorder videos" });
  }
};

const reNamePlaylist = async (req, res) => {
  const { playlistId, newName } = req.body;

  if (!playlistId || !newName) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    playlist.title = newName;
    await playlist.save();

    return res.json(new ApiResponse(200, {}, "Renamed Successfully", true));
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const changeCategory = async (req, res) => {
  const { playlistId } = req.body;

  if (!playlistId) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  try {
    const playlist = await playlistModel.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }
    if (playlist.category == "public") {
      playlist.category = "hidden";
    } else {
      playlist.category = "public";
    }
    await playlist.save();

    return res.json(
      new ApiResponse(200, {}, "Category updated Successfully", true)
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const removeVideosFromPlaylist = asyncHandler(async (req, res) => {
  const { videoIds, playlistId } = req.body;

  if (
    !videoIds ||
    !Array.isArray(videoIds) ||
    videoIds.length === 0 ||
    !playlistId
  ) {
    return res.status(400).json({ error: "Missing video IDs or playlist ID" });
  }

  const updatedPlaylist = await playlistModel.findOneAndUpdate(
    { _id: playlistId },
    { $pull: { videos: { $in: videoIds } } },
    { new: true }
  );

  if (!updatedPlaylist) {
    return res.status(404).json({ error: "Playlist not found" });
  }

  const result = await playlistModel.updateMany(
    { 
      _id: { $ne: playlistId },
      videos: { $in: videoIds }
    },
    { $pull: { videos: { $in: videoIds } } }
  );

  return res.json(
    new ApiResponse(
      200,
      {
        updatedPlaylist,
        otherPlaylistsUpdated: result.modifiedCount
      },
      `Videos removed from playlist and ${result.modifiedCount} other playlists`,
      true
    )
  );
});
export {
  createPlaylist,
  getPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistVideos,
  deletePlaylist,
  getPLThumbnail,
  reOrderVideos,
  reNamePlaylist,
  changeCategory,
  removeVideosFromPlaylist,
};
