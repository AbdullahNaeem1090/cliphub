import mongoose from "mongoose";

const WatchHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videos",
      required: true,
    },
    watchedAt: { type: Date, default: Date.now }
  },
 
);

export const whatchHistoryModel = mongoose.model(
  "watchHistory",
  WatchHistorySchema
);
