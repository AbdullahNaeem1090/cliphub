import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path"

cloudinary.config({
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {

  console.log(process.env.CLOUDINARY_CLOUD_NAME);
  console.log(process.env.DB_URL);
  
  
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
console.log("ponch gya");

    let resp = await cloudinary.uploader.upload(localFilePath, options);
console.log(resp);

    console.log("File uploaded to Cloudinary");
    fs.unlinkSync(localFilePath);
    return resp;
  } catch (err) {
    console.log("uyaha");
    console.log(error);
    
    fs.unlinkSync(localFilePath);
    return null;
  }
};


const deletefromCloudinary= async (publicIdAray,type) => {
  try {
    const result = await cloudinary.api.delete_resources(publicIdAray,{
      resource_type: type,  
    });
  } catch (error) {
    console.error("Error deleting video:", error);
  }
};




export { uploadOnCloudinary,deletefromCloudinary };

