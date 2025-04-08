import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { videoModel } from "../models/video.model.js";
import { playlistModel } from "../models/playlist.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const createPlaylist = asyncHandler(async (req, res) => {
  const { title, playlistVideo, category } = req.body;
  if ([title, playlistVideo, category].some((field) => field == "")) {
    res.status(400).json({ error: "A field is missing" });
  }
  const token = req?.cookies.accessToken;
  if (!token) {
    res.status(400).json({ error: "Access token expired plz login Again" });
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    res.status(400).json({ error: "User not identified plz login Again" });
  }
  const userId = decodedToken._id;
  const userExist = await userModel.findById(userId);
  if (!userExist) {
    res.status(400).json({ error: "User doest not exist" });
  }

  const createdPlaylist = await playlistModel.create({
    owner: userId,
    title: title,
    videos: [playlistVideo],
    category: category,
  });

  console.log(createdPlaylist);

  if (!createdPlaylist) {
    res.status(500).json({ error: "Server Side error" });
  }

  if (createdPlaylist.category == "private") {
    const updateVideoDoc = await videoModel.findByIdAndUpdate(
      createdPlaylist.videos[0],
      {
        $push: { playListMember: createdPlaylist._id },
      },
      { new: true }
    );
    if (!updateVideoDoc) {
      res.json({ error: "video doc couldnt be updated" });
    }
    console.log(updateVideoDoc);
  }

  return res.json(new ApiResponse(200, createdPlaylist, "playlist created"));
});

const getPlaylists = asyncHandler(async (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) {
    res.status(400).json({ error: "Access token expired plz login Again" });
  }
  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedToken) {
    res.status(400).json({ error: "User not identified plz login Again" });
  }
  const userId = decodedToken._id;
  const userExist = await userModel.findById(userId);
  if (!userExist) {
    res.status(400).json({ error: "User doest not exist" });
  }

  const myPlaylists = await playlistModel.find({
    owner: userId,
    category: "public",
  });
  const privatePlaylists = await playlistModel.find({
    owner: userId,
    category: "private",
  });
  return res.json(
    new ApiResponse(200, { myPlaylists, privatePlaylists }, "playlist created")
  );
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

  return res.json(new ApiResponse(200, {}._id, "video added",true));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { videoId, playlistId } = req.params;
    if (!videoId || !playlistId) {
      return res.status(400).json({ error: "ID missing" });
    }
  
    const updatedPlaylist = await playlistModel.findOneAndUpdate(
      { _id: playlistId },
      { $pull: { videos: videoId } },
    );
  
    if (!updatedPlaylist) {
      return res.status(404).json({ error: "Playlist not found" });
    }
  
    return res.json(new ApiResponse(200, {}, "Video removed from playlist", true));
  });
  

const getPlaylistVideos = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  console.log(playlistId);
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
              as: "videoCreator",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      $project: {
        playlistVideos: {
          title: 1,
          _id: 1,
          thumbnail: 1,
          videoCreator: 1,
        },
      },
    },
  ]);
  res.json(new ApiResponse(200, playlistVideos, "videos Sent"));
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

export {
  createPlaylist,
  getPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  getPlaylistVideos,
  deletePlaylist,
};
