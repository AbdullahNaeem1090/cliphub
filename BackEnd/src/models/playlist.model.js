import mongoose from "mongoose";

const playlistSchema= mongoose.Schema({
    owner:{
      type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    videos:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"videos"
    }],
    category:{
        type:String,
        required:true
    }

})

export const playlistModel=mongoose.model("playlists",playlistSchema)