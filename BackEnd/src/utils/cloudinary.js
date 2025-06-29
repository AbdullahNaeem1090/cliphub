import dotenv from "dotenv"
dotenv.config()
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {

  try {
    if (!localFilePath) return null;

    let options = {};

    const fileType = localFilePath.split(".").pop().toLowerCase();

    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp", "svg"].includes(fileType)
    ) {
      options = {
        resource_type: "image",
        quality: "auto:best",
        fetch_format: "auto",
        transformation: [{ width: 1200, crop: "limit" }],
      };
    } else if (["mp4", "mov", "avi", "mkv", "webm"].includes(fileType)) {
      options = {
        resource_type: "video",
        quality: "auto",
        transformation: [
          { width: 1280, crop: "limit" },
          { video_codec: "auto" },
          { bit_rate: "1m" },
        ],
      };
    } else {
      options = {
        resource_type: "auto",
      };
    }

    let resp = await cloudinary.uploader.upload(localFilePath, options);

    console.log("File uploaded to Cloudinary");
    fs.unlinkSync(localFilePath);
    return resp;
  } catch (err) {
    console.log(err);

    fs.unlinkSync(localFilePath);
    return null;
  }
};


const deletefromCloudinary = async (publicIdAray, type) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIdAray, {
      resource_type: type,
    });
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};




export { uploadOnCloudinary, deletefromCloudinary };

