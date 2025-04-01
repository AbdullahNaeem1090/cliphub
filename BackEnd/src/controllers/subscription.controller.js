import { asyncHandler } from "../utils/asyncHandler.js";
import { subscriptionModel } from "../models/subscription.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const subscribe = asyncHandler(async (req, res) => {

    const { subscriber, subscribedTo } = req.body

    const doc = await subscriptionModel.create({
        subscriber, subscribedTo
    })
    return res.json(
        new ApiResponse(200, doc, "subscribed")
    )
})
const unSubscribe = asyncHandler(async (req, res) => {

    const { subscriber, subscribedTo } = req.body

    const doc = await subscriptionModel.deleteOne({
        subscriber,
        subscribedTo
    })
    return res.json(
        new ApiResponse(200, doc, "UnSubscribed")
    )
})
const subscribedChannels = asyncHandler(async (req, res) => {

    const { subscriber } = req.params
    console.log(subscriber)
    const doc = await subscriptionModel.aggregate([
        {
            $match: { subscriber:new mongoose.Types.ObjectId(subscriber) }
        },
        {
            $lookup: {
                from: "users",
                localField: "subscribedTo",
                foreignField: "_id",
                as: "ContentCreators",
                pipeline: [
                    {
                        $lookup: {
                            from: "subscriptions",
                            localField: "_id",
                            foreignField: "subscribedTo",
                            as: "subscriptionDetails",
                        }
                    },
                    {
                        $project: {
                            _id:1,
                            username: 1,
                            email: 1,
                            avatar: 1,
                        }
                    }
                ]
            }
        },
        {
            $project:{
                ContentCreators:1
            }
        }
    ])
    return res.json(
        new ApiResponse(200, doc, "channel sent")
    )
})




export { subscribe, unSubscribe, subscribedChannels }