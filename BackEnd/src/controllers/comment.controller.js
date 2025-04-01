import { asyncHandler } from "../utils/asyncHandler.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const postComment = asyncHandler(async (req, res) => {

    const { comment, Commented_Video_id, author } = req.body

    const doc = await commentModel.create({
        comment, Commented_Video_id, author
    })
   return res.json(
        new ApiResponse(200, doc, "posted")
    )
})
const delComment = asyncHandler(async (req, res) => {

    const { _id } = req.params

    const doc = await commentModel.findByIdAndDelete(_id)

   return res.json(
        new ApiResponse(200, doc, "deleted")
    )
})



export { postComment,delComment}