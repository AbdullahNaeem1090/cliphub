import mongoose from "mongoose";

const commentSchema= mongoose.Schema({
    author:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    Commented_Video_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"videos"
    },
    comment:{
        type:String,
        trim:true,
        required:true
    },
    replies:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"rep_comments"
    }]

})

export const commentModel=mongoose.model("comments",commentSchema)

