import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { videoModel } from "../models/video.model.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import {
  deletefromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { playlistModel } from "../models/playlist.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// -------------------------------------------

export function get_PublicId_From_URL(url) {
  const publicId = url.split("/").pop().split(".")[0];
  return publicId;
}

// -------------------------------------------

const uploadVideo = asyncHandler(async (req, res) => {
  const { owner, title, description } = req.body;

  if ([owner, title].some((field) => field?.trim() === "")) {
    return res
      .status(400)
      .json({ message: "Some field is missing", success: false });
  }

  const vidUrl = req.files?.vid[0].path;
  const picUrl = req.files?.pic[0].path;

  if (!(vidUrl && picUrl)) {
    return res
      .status(400)
      .json({ message: "Uploading file is missing", success: false });
  }

  const videoUploaded = await uploadOnCloudinary(vidUrl);
  const picUploaded = await uploadOnCloudinary(picUrl);


  if (!(videoUploaded?.url && picUploaded?.url)) {
    return res
      .status(500)
      .json({ message: "Could not upload", success: false });
  } else {
    console.log("Uploaded");
  }

  const creatingVideoDoc = await videoModel.create({
    videoURL: videoUploaded.url,
    thumbnail: picUploaded.url,
    duration: videoUploaded.duration,
    owner,
    title,
    description: description || "",
  });

  return res.json(new ApiResponse(200, creatingVideoDoc, "✅ Video Uploaded"));
});


const verifyVideo = async (req, res) => {
  let { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json({ message: "videoID mising", success: false });
  }
  let video = await videoModel.findById(videoId);
  if (!videoId) {
    return res
      .status(400)
      .json({ message: "videoID not found", success: false });
  }
  video.isVerified = true;
  let updatedVideo = await video.save();

  if (!updatedVideo) {
    return res
      .status(500)
      .json({ message: "video could not be verified", success: false });
  }

  return res.json(
    new ApiResponse(200, updatedVideo, "✅ Video Uploaded and verifed")
  );
};

const deleteGarbageVideos = asyncHandler(async (req, res) => {
  try {
    let videos = await videoModel
      .find({
        $or: [
          { isVerified: { $ne: true } }, // isVerified is not true
          { isVerified: { $exists: false } }, // isVerified field does not exist
        ],
      })
      .limit(2);


    let thumbnailArray_Of_PublicIds = [];
    let videoArray_Of_PublicIds = [];

    for (let video of videos) {
      thumbnailArray_Of_PublicIds.push(get_PublicId_From_URL(video.thumbnail));
      videoArray_Of_PublicIds.push(get_PublicId_From_URL(video.videoURL));
    }

    if (!videos.length > 0) {
      return res.status(300).json({ message: "No unverified Video" });
    }

    await deletefromCloudinary(thumbnailArray_Of_PublicIds, "image");
    await deletefromCloudinary(videoArray_Of_PublicIds, "video");

    const deleteResult = await videoModel.deleteMany({
      _id: { $in: videos.map((video) => video._id) },
    });

    return res.status(200).json({
      message: "Videos deleted successfully",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error deleting videos", error });
  }
});

const getUserVideos = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Id missing" });
  }


  const myVideos = await videoModel
    .find({ owner: userId, isVerified: true })
    .select("_id thumbnail title videoURL createdAt");

  return res.json(
    new ApiResponse(200, myVideos, "Myvideos retrieval successfull", true)
  );
});

const deleteMyVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId) {
    res.json({ error: "Video Id mising" });
  }

  const video = await videoModel.findById(videoId);

  let pic = get_PublicId_From_URL(video?.thumbnail);
  let videoUrl = get_PublicId_From_URL(video?.videoURL);

  await deletefromCloudinary([pic], "image");
  await deletefromCloudinary([videoUrl], "video");

  const deleted = await videoModel.deleteOne({ _id: videoId });
  const updatePlaylists = await playlistModel.updateMany(
    { videos: videoId },
    {
      $pull: { videos: videoId },
    }
  );

  return res.json(
    new ApiResponse(200, { deleted, updatePlaylists }, "video deleted")
  );
});



//substitute id:2
const getPlayingVideoData = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.params;

  if (!videoId || !userId) {
    return res.status(400).json({ message: "Id missing" });
  }

  let mongoVideoId = new mongoose.Types.ObjectId(videoId);
  let mongoUserId = new mongoose.Types.ObjectId(userId);
  let playListInfo = await playlistModel.find({
    owner: userId,
  });

  const videoDetails = await videoModel.aggregate([
    {
      $match: {
        _id: mongoVideoId,
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedVideoId",
        as: "likesInfo",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "VideoCreator",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscribedTo",
              as: "SubscriptionInfo",
            },
          },
        ],
      },
    },
    {
      $unwind: { path: "$VideoCreator", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "Commented_Video_id",
        as: "Comments",
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "commenter",
              pipeline: [{ $project: { username: 1, avatar: 1 } }],
            },
          },
          { $unwind: "$commenter" },
        ],
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$likesInfo" },
        isLikedByCurrentUser: { $in: [mongoUserId, "$likesInfo.likedById"] },
        subscribersCount: { $size: "$VideoCreator.SubscriptionInfo" },
        hasSubscribed: {
          $in: [mongoUserId, "$VideoCreator.SubscriptionInfo.subscriber"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        videoURL: 1,
        createdAt: 1,
        likesCount: 1,
        isLikedByCurrentUser: 1,
        subscribersCount: 1,
        hasSubscribed: 1,
        "Comments._id": 1,
        "Comments.author": 1,
        "Comments.comment": 1,
        "Comments.commenter": 1,
        "VideoCreator.username": 1,
        "VideoCreator._id": 1,
        "VideoCreator.avatar": 1,
      },
    },
  ]);

  if (videoDetails.length === 0) {
    return res.status(404).json({ message: "Video not found" });
  }
  videoDetails[0].playListInfo = playListInfo;

  return res.json(new ApiResponse(200, videoDetails[0], "Video details sent"));
});


//substitue id:1
const getnewVideos = asyncHandler(async (req, res) => {
  let { lastVideoId } = req.params;
  if (!lastVideoId) {
    lastVideoId = "000000000000000000000000";
  }

  let objId = new mongoose.Types.ObjectId(lastVideoId);
  let limit = 9;

  let videoSet = await videoModel.aggregate([
    {
      $match: {
        isVerified: true,
        _id: { $gt: objId },
      },
    },
    {
      $limit: limit,
    },
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
        _id: 1,
        title: 1,
        thumbnail: 1,
        avatar: "$videoCreaters.avatar",
        username: "$videoCreaters.username",
        videoURL: 1,
      },
    },
  ]);

  let nextCursorId = videoSet[videoSet.length - 1]?._id || undefined;

  let responseData = {
    data: videoSet,
    nextCursor: nextCursorId,
  };
  return res.json(new ApiResponse(200, responseData, "videos sent", true));
});

const searchApi = asyncHandler(async (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  const [videoResults, userResults] = await Promise.all([
    videoModel
      .find({
        title: { $regex: query, $options: "i" },
      })
      .limit(5)
      .select("title _id"),

    userModel
      .find({
        username: { $regex: query, $options: "i" },
      })
      .limit(5)
      .select("_id username"),
  ]);

  const combinedResults = videoResults.concat(userResults);

  return res.json(new ApiResponse(200, combinedResults, "sent"));
});

const searchedVideos = asyncHandler(async (req, res) => {
  const { query } = req.params;
  const matchedVideos = await videoModel.aggregate([
    {
      $match: {
        title: { $regex: query, $options: "i" },
      },
    },
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
        _id: 1,
        title: 1,
        thumbnail: 1,
        avatar: "$videoCreaters.avatar",
        username: "$videoCreaters.username",
        videoURL: 1,
      },
    },
  ]);

  return res.json(new ApiResponse(200, matchedVideos, "sent"));
});

const editVideo = async (req, res) => {
  try {

    const updateFields = {};

    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;

    if (req.file) {
      const video = await videoModel.findById(req.params.id);
      if (video?.thumbnail) {
        await deletefromCloudinary(
          [get_PublicId_From_URL(video.thumbnail)],
          "image"
        );
      }

      const picUploaded = await uploadOnCloudinary(req.file.path);
      updateFields.thumbnail = picUploaded.url;
    }
    const updatedVideo = await videoModel.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedVideo)
      return res.status(404).json({ message: "Video not found" });

    return res.json(new ApiResponse(200, updatedVideo, "Video updated", true));
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const deleteMultipleVieos = asyncHandler(async (req, res) => {
  let { videoIds } = req.body;
  try {
    const videos = await videoModel.find({ _id: { $in: videoIds } });

    let thumbnailArray_Of_PublicIds = [];
    let videoArray_Of_PublicIds = [];

    for (let video of videos) {
      thumbnailArray_Of_PublicIds.push(get_PublicId_From_URL(video.thumbnail));
      videoArray_Of_PublicIds.push(get_PublicId_From_URL(video.videoURL));
    }

    if (!videos.length > 0) {
      return res.status(300).json({ message: "No unverified Video" });
    }

    await deletefromCloudinary(thumbnailArray_Of_PublicIds, "image");
    await deletefromCloudinary(videoArray_Of_PublicIds, "video");

    const deleteResult = await videoModel.deleteMany({
      _id: { $in: videos.map((video) => video._id) },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          deleteResult.deletedCount,
          "Videos deleted successfully",
          true
        )
      );
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error deleting videos", error });
  }
});

export {
  getPlayingVideoData,
  getnewVideos,
  verifyVideo,
  uploadVideo,
  getUserVideos,
  deleteMyVideo,
  searchApi,
  searchedVideos,
  deleteGarbageVideos,
  editVideo,
  deleteMultipleVieos,
};
