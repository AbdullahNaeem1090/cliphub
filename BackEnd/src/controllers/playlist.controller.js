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
  let video=[]
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
        playlistVideos: 1,
      },
    },
  ]);

  res.json(
    new ApiResponse(200, playlistVideos[0], "playlist videos sent", true)
  );
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

export {
  createPlaylist,
  getPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistVideos,
  deletePlaylist,
  getPLThumbnail,
};
