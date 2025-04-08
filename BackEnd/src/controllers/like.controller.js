import { asyncHandler } from "../utils/asyncHandler.js";
import { likeModel } from "../models/like.model.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addLike = asyncHandler(async (req, res) => {

  const { videoId, userId } = req.body;

  if (!videoId || !userId) {
    return res.status(400).json("Id missing");
  }

  const doc = await likeModel.create({
    likedVideoId: videoId,
    likedById: userId,
  });

  if (!doc) {
    return res.status(500).json("could not add like");
  }

  return res.json(new ApiResponse(200, {}, "lie added", true));
});

const removeLike = asyncHandler(async (req, res) => {
  const { videoId, userId } = req.body;

  const doc = await likeModel.deleteOne({
    likedVideoId: videoId,
    likedById: userId,
  });

  if (!doc) {
    return res.status(500).json("could not add like");
  }

  return res.json(new ApiResponse(200, {}, "like removed", true));
});

const likedVideos = asyncHandler(async (req, res) => {
  const { likedById } = req.params;

  const doc = await likeModel
    .find({
      likedById,
    })
    .select("likedVideoId");

  return res.json(new ApiResponse(200, doc, "liked"));
});

export { addLike, removeLike, likedVideos };
