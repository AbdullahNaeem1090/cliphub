import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { userModel } from "../models/user.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { deletefromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";
import { generateAccessAndRefereshTokens } from "../middlewares/auth.js";
import { subscriptionModel } from "../models/subscription.model.js";
import { get_PublicId_From_URL } from "./video.controller.js";


const userSignUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ([username, email, password].some((field) => field?.trim() === "")) {
    throw new apiError(200, "ALL fields are requirerd");
  }

  let userExists = await userModel.findOne({ email });

  if (userExists) {
    return res
      .status(409)
      .json({ error: "User already exists. Try new email" });
  }

  let createdUser = await userModel.create({
    username,
    email,
    password,
  });

  let user = await userModel
    .findById(createdUser._id)
    .select("-password -refreshToken");

  if (!user) {
    return res
      .status(409)
      .json({ error: "Something went wrong with SignUp. Try again" });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User registered Successfully"));
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (email == "" || password == "") {
    res.status(400).json({ message: "Both fields are required" });
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Wrong Email" });
  }
  const passIsCorrect = await user.isPasswordCorrect(password);
  if (!passIsCorrect) {
    return res.status(400).json({ message: "Incorrect Password" });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id
  );

  const loggedInUser = await userModel
    .findById(user._id)
    .select("-password -refreshToken -watchHistory -createdAT -updatedAt");

  return res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite:"None",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite:"None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(new ApiResponse(200, loggedInUser, "logged In", true));
});

const uploadAvatar = asyncHandler(async (req, res) => {
  let localFilePath = req.file.path;
  if (!localFilePath) {
    res.status(400, { message: "no file recieved" });
  }

  let response = await uploadOnCloudinary(localFilePath);
  if (!response?.url) {
    res.status(400, { message: "Could not upload. try Again" });
  }

  const beforeUpdate = await userModel
    .findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: response.url },
      },
    )

   let publicUrl= get_PublicId_From_URL(beforeUpdate?.avatar)
   await deletefromCloudinary([publicUrl],"image")

  const updatedUser = await userModel
    .findByIdAndUpdate(
      req.user?._id,
      {
        $set: { avatar: response.url },
      },
      { new: true }
    )
    .select("-password -refreshToken");


  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});

const currUser = asyncHandler(async (req, res) => {
  let userId = req.user._id;

  let subscribers = await subscriptionModel.aggregate([
    {
      $match: {
        subscribedTo: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $count: "subscribersCount",
    },
  ]);

  // Convert to plain object (important!)
  const userData = req.user.toObject ? req.user.toObject() : { ...req.user };

  userData.subscribersCount = subscribers[0]?.subscribersCount || 0;


  return res.json(new ApiResponse(210, userData, "User Verified and sent"));
});


const recheck = asyncHandler(async (req, res) => {
  if (req.cookies?.accessToken) {
    res.send("userConfirmed");
  } else {
    console.log("not ok");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  await userModel.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .send("logged out");
});
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ success: false, error: "Both fields are required" });
  }

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const isCorrect = await user.isPasswordCorrect(currentPassword);
  if (!isCorrect) {
    return res.status(401).json({ success: false, error: "Wrong password" });
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(200, {}, "Password changed successfully", true)
  );
});

const getUserChannelDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.json({ error: "Id not provided" });
  }

  const channelDetails = await userModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscribedTo",
        as: "subscribers",
      },
    },
    {
      $project: {
        _id: 1,
        username: 1,
        email: 1,
        avatar: 1,
        subscribersCount: { $size: "$subscribers" },
      },
    },
  ]);

  return res.json(new ApiResponse(200, channelDetails, "done",true));
});

const addToWatchHistory = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!videoId) {
    return res.json({ error: "id not provided" });
  }
  const user = await userModel.findByIdAndUpdate(
    req.user,
    {
      $push: {
        watchHistory: {
          $each: [videoId],
          $position: 0,
          $slice: 20,
        },
      },
    },
    { new: true }
  );
  return res.json(new ApiResponse(200, {}, "updated"));
});

const getWatchHistory = asyncHandler(async (req, res) => {
  const userWatchHistory = await userModel.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user._id) },
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
              as: "videoCreator",
            },
          },
        ],
      },
    },
    {
      $project: {
        WatchedVideos: {
          _id: 1,
          title: 1,
          thumbnail: 1,
          videoCreator: {
            username: 1,
            avatar: 1,
          },
        },
      },
    },
  ]);
  return res.json(new ApiResponse(200, userWatchHistory, "done"));
});

const remVidFromWatchHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    $pull: { watchHistory: id },
  });
  return res.json(new ApiResponse(200, user, "done"));
});
const clearWatchHistory = asyncHandler(async (req, res) => {
  const user = await userModel.findByIdAndUpdate(req.user._id, {
    $set: { watchHistory: [] },
  });
  return res.json(new ApiResponse(200, user, "done"));
});

export {
  userSignUp,
  userLogin,
  uploadAvatar,
  currUser,
  recheck,
  logoutUser,
  changePassword,
  getUserChannelDetails,
  addToWatchHistory,
  getWatchHistory,
  remVidFromWatchHistory,
  clearWatchHistory,
};
