import { asyncHandler } from "../utils/asyncHandler.js";
import { Rep_CommentModel } from "../models/repliedComments.model.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const postReply = asyncHandler(async (req, res) => {
  const { ParentComment_id, rep_comment, author } = req.body;

  const doc = await Rep_CommentModel.create({
    rep_comment,
    ParentComment_id,
    author,
  });

  await commentModel.findByIdAndUpdate(ParentComment_id, {
    $push: { replies: doc._id },
  });

  return res.json(new ApiResponse(200, doc, "posted", true));
});
const getReplies = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!commentId) {
    return res.status(400).json({ message: "Missing id" });
  }

  const replyComments = await Rep_CommentModel.aggregate([
    {
      $match: { ParentComment_id: new mongoose.Types.ObjectId(commentId) },
    },
    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "replier",
      },
    },
    {
      $unwind: "$replier",
    },
    {
      $project: {
        _id: 1,
        author: 1,
        ParentComment_id: 1,
        rep_comment: 1,
        createdAt: 1,
        replier: {
          _id: "$replier._id",
          username: "$replier.username",
          avatar: "$replier.avatar",
        },
      },
    },
  ]);

  return res.json(new ApiResponse(200, replyComments, "replies Sent", true));
});

const delReply = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  const doc = await Rep_CommentModel.deleteOne({ _id});

  return res.json(new ApiResponse(200, doc, "replyDeleted", true));
});

export { postReply, delReply, getReplies };
