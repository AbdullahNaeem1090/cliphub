import { asyncHandler } from "../utils/asyncHandler.js";
import { subscriptionModel } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const subscribe = asyncHandler(async (req, res) => {
  const { subscriber, subscribedTo } = req.body;

  const doc = await subscriptionModel.create({
    subscriber,
    subscribedTo,
  });
  return res.json(new ApiResponse(200, doc, "subscribed"));
});
const unSubscribe = asyncHandler(async (req, res) => {
  const { subscriber, subscribedTo } = req.body;

  const doc = await subscriptionModel.deleteOne({
    subscriber,
    subscribedTo,
  });
  return res.json(new ApiResponse(200, doc, "UnSubscribed"));
});
const subscribedChannels = asyncHandler(async (req, res) => {
  const { subscriber } = req.params;

  if (!subscriber) {
    return res.json("Subscriber Id missing");
  }

  const channels = await subscriptionModel.aggregate([
    {
      $match: {
        subscriber: new mongoose.Types.ObjectId(subscriber),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "subscribedTo",
        foreignField: "_id",
        as: "Channel",
        pipeline: [
          {
            $lookup: {
              from: "subscriptions",
              localField: "_id",
              foreignField: "subscribedTo",
              as: "subscribers",
            },
          },
          {
            $addFields: {
              subscribersCount: { $size: "$subscribers" },
            },
          },
        ],
      },
    },
    {
      $unwind: "$Channel",
    },
    {
      $project: {
        "Channel._id": 1,
        "Channel.email": 1,
        "Channel.username": 1,
        "Channel.avatar": 1,
        "Channel.subscribersCount":1
      },
    },

  ]);

  return res.json(new ApiResponse(200, channels, "channel sent", true));
});

export { subscribe, unSubscribe, subscribedChannels };
