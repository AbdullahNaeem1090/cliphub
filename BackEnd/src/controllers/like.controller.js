import { asyncHandler } from "../utils/asyncHandler.js";
import { likeModel } from "../models/like.model.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const addLike = asyncHandler(async (req, res) => {

    const { likedVideoId, likedById } = req.body

    const doc = await likeModel.create({
        likedVideoId,likedById
    })

    return res.json(
        new ApiResponse(200, doc, "lie added")
    )
})


const removeLike = asyncHandler(async (req, res) => {

    const { likedVideoId, likedById } = req.body

    const doc = await likeModel.deleteOne({
        likedVideoId,likedById
    })

    return res.json(
        new ApiResponse(200, doc, "like removed")
    )
})

const likedVideos = asyncHandler(async (req, res) => {

    const {likedById } = req.params

    const doc = await likeModel.find({
       likedById
    }).select("likedVideoId")
 

   return res.json(
        new ApiResponse(200, doc, "liked")
    )
})

export { addLike, removeLike,likedVideos }