import mongoose from "mongoose";

const Rep_CommentSchema= mongoose.Schema({
    author:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    ParentComment_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments"
    },
    rep_comment:{
        type:String,
        required:true
    }

})

export const Rep_CommentModel=mongoose.model("rep_comments",Rep_CommentSchema)