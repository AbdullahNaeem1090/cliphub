import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

// forgot password functionality is yet to be done

async function generateToken(userId) {

   try {
      const user = await userModel.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken

      await user.save({ validateBeforeSave: false })

      return { accessToken, refreshToken }
   } catch (error) {
      throw new apiError(500, "something went wrong")
   }
}


const userSignUp = asyncHandler(async (req, res) => {
   const { username, email, password } = req.body

   if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new apiError(200, "ALL fields are requirerd")
   }

   let userExists = await userModel.findOne({ email })

   if (userExists) {
      return res.status(409).json({ error: 'User already exists. Try new email' })
   }

   let createdUser = await userModel.create({
      username,
      email,
      password
   })

   let user = await userModel.findById(createdUser._id).select(
      "-password -refreshToken"
   )

   if (!user) {
      return res.status(409).json({ error: 'Something went wrong with SignUp. Try again' })
   }

   return res.status(200).json(
      new ApiResponse(200, user, "User registered Successfully")
   )

})

const userLogin = asyncHandler(async (req, res) => {
   const { email, password, rememberMe } = req.body


   if (email == "" || password == "") {
      res.status(400).json({ message: "Both fields are required" })
   }

   const user = await userModel.findOne({ email })
   if (!user) {
      return res.status(400).json({ message: "Wrong Email" })
   }
   const passIsCorrect = await user.isPasswordCorrect(password)
   if (!passIsCorrect) {
      return res.status(400).json({ message: "Incorrect Password" })
   }

   const { accessToken, refreshToken } = await generateToken(user._id)

   const loggedInUser = await userModel.findById(user._id).select("-password -refreshToken")

   if (rememberMe) {
      return res
         .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 3 * 24 * 60 * 60 * 1000
         })
         .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
         })
         .json(new ApiResponse(200, loggedInUser, "logged In"))
   } else {
      console.log("done")
      return res
         .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
         })
         .json(new ApiResponse(200, loggedInUser, "logged In"))
   }

})

const uploadAvatar = asyncHandler(async (req, res) => {

   let localFilePath = req.file.path
   if (!localFilePath) {
      res.status(400, { message: "no file recieved" })
   }

   let response = await uploadOnCloudinary(localFilePath)
   if (!response?.url) {
      res.status(400, { message: "Could not upload. try Again" })
   }

   const updatedUser = await userModel.findByIdAndUpdate(req.user?._id,
      {
         $set: { avatar: response.url }
      },
      { new: true }
   ).select("-password -refreshToken")

   return res
      .status(200)
      .json(
         new ApiResponse(200, updatedUser, "Cover image updated successfully")
      )

})

const currUser = asyncHandler(async (req, res) => {

   return res.json(
      new ApiResponse(200, req.user, "User Verified and sent")
   )
})

const recheck = asyncHandler(async (req, res) => {
   if (req.cookies?.accessToken) {
      console.log("ok")
      res.send("userConfirmed")
   } else {
      console.log("not ok")
   }
})

const logoutUser = asyncHandler(async (req, res) => {
   await userModel.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1
         }
      },
      {
         new: true
      }
   )

   const options = {
      httpOnly: true,
      secure: true
   }


   return res.clearCookie("accessToken", options)
      .clearCookie("refreshToken", options).send("logged out")

})

const changePassword = asyncHandler(async (req, res) => {

   const { currentPassword, newPassword } = req.body
   if (!(currentPassword && newPassword)) {
      res.json({ error: "both fields are required" })
   }

   let user = await userModel.findById(req.user._id)
   const passCorrect = await user.isPasswordCorrect(currentPassword)

   if (!passCorrect) {
      return res.json({ error: "Wrong Password" })
   }

   user.password = newPassword
   await user.save({ validateBeforeSave: false })

   return res.json(new ApiResponse(200, {}, "Password changed successfully"))

})

const getUserChannelDetails = asyncHandler(async (req, res) => {

   const { id } = req.params

   if (!id) {
      return res.json({ error: "Id not provided" })
   }

   const channelDetails = await userModel.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(id)
         }
      },
      {
         $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "videos",
            pipeline: [{
               $project: {
                  title: 1,
                  thumbnail: 1,
                  _id: 1
               }
            }]
         }
      },
      {
         $lookup: {
            from: "playlists",
            let: { "id": "$_id" },
            pipeline: [{
               $match: {
                  $expr: {
                     $and: [
                        { $eq: ["$owner", "$$id"] },
                        { $eq: ["$category", "public"] },
                     ]
                  }
               }
            }, {
               $project: {
                  _id: 1,
                  videos: 1,
                  title: 1
               }
            }],
            as: "playlists"
         }
      },
      {
         $lookup: {
            from: "subscriptions",
            localField: "_id",
            foreignField: "subscribedTo",
            as: "subscribers"
         }
      },
      {
         $project: {
            _id: 1,
            username: 1,
            email: 1,
            avatar: 1,
            videos: 1,
            playlists: 1,
            subscribers: { $size: "$subscribers" }
         }
      }
   ])

   return res.json(
      new ApiResponse(200, channelDetails, "done")
   )

})

const addToWatchHistory = asyncHandler(async (req, res) => {
   const { videoId } = req.params
   if (!videoId) {
      return res.json({ error: "id not provided" })
   }
   const user = await userModel.findByIdAndUpdate(
      req.user,
      {
         $push: {
            watchHistory: {
               $each: [videoId],
               $position: 0,
               $slice: 20
            }
         }
      },
      { new: true }
   )
   return res.json(
      new ApiResponse(200, {}, "updated")
   )

})

const getWatchHistory = asyncHandler(async (req, res) => {
   const userWatchHistory = await userModel.aggregate([
      {
         $match: { _id: new mongoose.Types.ObjectId(req.user._id) }
      },
      {
         $lookup: {
            from: "videos",
            localField: "watchHistory",
            foreignField: "_id",
            as: "WatchedVideos",
            pipeline: [
               {
                  $lookup: {
                     from: "users",
                     localField: "owner",
                     foreignField: "_id",
                     as: "videoCreator"
                  }
               }
            ]
         }
      }, {
         $project: {
            WatchedVideos: {
               _id: 1,
               title: 1,
               thumbnail: 1,
               videoCreator: {
                  username: 1,
                  avatar: 1
               }
            }
         }
      }
   ])
   return res.json(
      new ApiResponse(200, userWatchHistory, "done")
   )
})

const remVidFromWatchHistory = asyncHandler(async (req, res) => {
   const { id } = req.params
   const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
         $pull: { watchHistory: id }
      }
   )
   return res.json(
      new ApiResponse(200, user, "done")
   )

})
const clearWatchHistory = asyncHandler(async (req, res) => {
   const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
         $set: { watchHistory: [] }
      }
   )
   return res.json(
      new ApiResponse(200, user, "done")
   )
})

export { userSignUp, userLogin, uploadAvatar, currUser, recheck, logoutUser, changePassword, getUserChannelDetails, addToWatchHistory, getWatchHistory, remVidFromWatchHistory, clearWatchHistory }
