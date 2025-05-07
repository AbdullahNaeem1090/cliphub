// routes/watchHistory.js
import mongoose from "mongoose";
import { whatchHistoryModel } from "../models/watchHistory.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { userId, videoId } = req.body;

  const newEntry = await whatchHistoryModel.findOneAndUpdate(
    { userId, videoId },
    { watchedAt: new Date() },
    { upsert: true, new: true }
  );

  return res.json(new ApiResponse(200, {}, "Added to watch history ", true));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  let { userId } = req.params;
  const history = await whatchHistoryModel.aggregate([
    {
      $match: { userId: new mongoose.Types.ObjectId(userId) },
    },
    {
      $sort: { watchedAt: -1 },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videoId",
        foreignField: "_id",
        as: "videos",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "videoCreaters",
              pipeline: [
                {
                  $project: { avatar: 1, username: 1 },
                },
              ],
            },
          },
          { $unwind: "$videoCreaters" },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              avatar: "$videoCreaters.avatar",
              username: "$videoCreaters.username",
            },
          },
        ],
      },
    },
    { $unwind: "$videos" },
    {
      $project: {
        _id: 1,
        videoId: 1,
        title: "$videos.title",
        thumbnail: "$videos.thumbnail",
        avatar: "$videos.avatar",
        username: "$videos.username",
      },
    },
  ]);

  return res.json(new ApiResponse(200, history, "watch history sent", true));
});

const deleteVideoFromHistory = asyncHandler(async (req, res) => {
  console.log("calleeee");
  await whatchHistoryModel.findByIdAndDelete(req.params.id);

  return res.json(new ApiResponse(200, {}, "Deleted", true));
});

const clearWatchHistory = asyncHandler(async (req, res) => {
  await whatchHistoryModel.deleteMany({ userId: req.params.userId });

  return res.json(new ApiResponse(200, {}, "Cleared", true));
});

export {
  addToWatchHistory,
  getWatchHistory,
  deleteVideoFromHistory,
  clearWatchHistory,
};
