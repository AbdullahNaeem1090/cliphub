import mongoose from 'mongoose'

const videoSchema= new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String
    },
    likes:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"likes"
    },
    playListMember: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "playlist",
        default: []
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"comments"
    },
    thumbnail:{
        type:String,
        required:true
    },
    videoURL:{
        type:String,
        required:true
    }
},{timestamps:true})

export const videoModel=mongoose.model("videos",videoSchema)