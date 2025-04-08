import { asyncHandler } from "../utils/asyncHandler.js";
import { commentModel } from "../models/comment.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Rep_CommentModel } from "../models/repliedComments.model.js";

const postComment = asyncHandler(async (req, res) => {

    const { comment, Commented_Video_id, author } = req.body

    if(!comment||!Commented_Video_id||!author){
        return res.status(400).json({message:"incomplete parameters"})
    }

    const doc = await commentModel.create({
        comment, Commented_Video_id, author
    })

   return res.json(
        new ApiResponse(200, doc, "posted",true)
    )
})
const delComment = asyncHandler(async (req, res) => {
    const { _id } = req.params

    if(!_id){
        return res.status(400).json({message:"id missing"})
    }

    const resp1 = await commentModel.findByIdAndDelete(_id)
    const resp2 = await Rep_CommentModel.deleteMany({ParentComment_id:_id})

    if(!resp1 || !resp2){
        return res.status(500).json({message:"could not delete"})
    }

   return res.json(
        new ApiResponse(200, {}, "deleted",true)
    )
})


export { postComment,delComment}