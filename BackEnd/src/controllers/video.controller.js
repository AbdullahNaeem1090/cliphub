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

function get_PublicId_From_URL(url) {
  const publicId = url.split("/").pop().split(".")[0];
  console.log(publicId);
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

  console.log(videoUploaded);

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
    duration:videoUploaded.duration,
    owner,
    title,
    description: description || "",
  });

  return res.json(new ApiResponse(200, creatingVideoDoc, "✅ Video Uploaded"));
});

// newIntegration
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

// newIntegration
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

    console.log(videos);

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

    console.log(
      `${deleteResult.deletedCount} video(s) were deleted from the database.`
    );

    return res.status(200).json({
      message: "Videos deleted successfully",
      deletedCount: deleteResult.deletedCount,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error deleting videos", error });
  }
});

const getMyVideos = asyncHandler(async (req, res) => {
  let user = req.user;
  console.log('hee');

  if (!user._id) {
    return res.status(400).json({ message: "Id missing" });
  }

  const myVideos = await videoModel
    .find({ owner: user._id, isVerified: true })
    .select("_id thumbnail title createdAt");

  return res.json(
    new ApiResponse(200, myVideos, "Myvideos retrieval successfull", true)
  );
});

const deleteMyVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    res.json({ error: "Video Id mising" });
  }
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

//deprecated id:2
const playingVideoData = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    return res.status(400).json({ message: "Video Id mising" });
  }

  const videoDetails = await videoModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "ownerDetails",
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              email: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "owner",
        foreignField: "subscribedTo",
        as: "subscribersArray",
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "likedVideoId",
        as: "liked_docs",
      },
    },
    {
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "Commented_Video_id",
        as: "comments",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "author",
              foreignField: "_id",
              as: "commenter",
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
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "Commented_Video_id",
        as: "reply_array",
        pipeline: [
          {
            $lookup: {
              from: "rep_comments",
              localField: "_id",
              foreignField: "ParentComment_id",
              as: "replies",
              pipeline: [
                {
                  $lookup: {
                    from: "users",
                    localField: "author",
                    foreignField: "_id",
                    as: "repliers",
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
        title: 1,
        videoURL: 1,
        description: 1,
        playListMember: 1,
        subscribersCount: { $size: "$subscribersArray" },
        likes_count: { $size: "$liked_docs" },
        "ownerDetails.username": 1,
        "ownerDetails.avatar": 1,
        "ownerDetails._id": 1,
        "ownerDetails.email": 1,
        "comments._id": 1,
        "comments.comment": 1,
        "comments.author": 1,
        "comments.commenter": 1,
        "reply_array.replies.rep_comment": 1,
        "reply_array.replies.ParentComment_id": 1,
        "reply_array.replies.repliers.username": 1,
        "reply_array.replies.repliers.avatar": 1,
      },
    },
  ]);

  console.log(videoDetails);

  return res.json(new ApiResponse(200, videoDetails, "video details sent"));
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

//deprecated id:1
const getAllVideos = asyncHandler(async (_, res) => {
  const allVideos = await videoModel.aggregate([
    { $match: { isVerified: true } },
    { $sample: { size: 10 } },
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
      },
    },
  ]);
  return res.json(new ApiResponse(200, allVideos, "videos sent"));
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
      },
    },
  ]);

  let nextCursorId = videoSet[videoSet.length - 1]?._id || undefined;

  let responseData = {
    data: videoSet,
    nextCursor: nextCursorId,
  };
  return res.json(new ApiResponse(200, responseData, "videos sent"));
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
      },
    },
  ]);

  return res.json(new ApiResponse(200, matchedVideos, "sent"));
});

export {
  getPlayingVideoData,
  getnewVideos,
  verifyVideo,
  uploadVideo,
  getMyVideos,
  deleteMyVideo,
  playingVideoData,
  getAllVideos,
  searchApi,
  searchedVideos,
  deleteGarbageVideos,
};
