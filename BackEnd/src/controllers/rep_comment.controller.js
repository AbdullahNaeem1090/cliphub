import { asyncHandler } from "../utils/asyncHandler.js";
import { Rep_CommentModel } from "../models/repliedComments.model.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";

const postReply = asyncHandler(async (req, res) => {

    const { ParentComment_id, rep_comment, author } = req.body

    const doc = await Rep_CommentModel.create({
        rep_comment, ParentComment_id, author
    })

    await commentModel.findByIdAndUpdate(
        ParentComment_id,
        { $push: { replies: doc._id } }
    )

    return res.json(
        new ApiResponse(200, doc, "posted")
    )
})


const delReply = asyncHandler(async (req, res) => {

    const { _id } = req.params

    const doc = await Rep_CommentModel.deleteOne({
        ParentComment_id: _id
    })

    return res.json(
        new ApiResponse(200, doc, "replyDeleted")
    )
})



export { postReply, delReply }

