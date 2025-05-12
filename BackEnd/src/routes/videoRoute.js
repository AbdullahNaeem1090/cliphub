import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyVideo,uploadVideo,getUserVideos,deleteMyVideo, searchApi, searchedVideos,deleteGarbageVideos,getnewVideos, getPlayingVideoData,editVideo, deleteMultipleVieos} from "../controllers/video.controller.js";

const vidRouter = Router()

vidRouter.route("/uploadVideo").post(upload.fields([
        {
            name: "vid",
            maxCount: 1
        },
        {
            name: "pic",
            maxCount: 1
        }
    ]),uploadVideo)

vidRouter.route("/userVideos/:userId").get(getUserVideos)   
vidRouter.route("/delVideo/:videoId").delete(deleteMyVideo)   
vidRouter.route("/search/:query").get(searchApi)   
vidRouter.route("/searchVideos/:query").get(searchedVideos)   
vidRouter.route("/editVideo/:id").put(upload.single("thumbnail"),editVideo)
vidRouter.route("/getnewVideos/:lastVideoId?").get(getnewVideos) //sub 1
vidRouter.route("/getPlayingVideoData/:videoId/:userId").get(getPlayingVideoData)   //sub 2

vidRouter.route("/deleteGarbageVideos").get(deleteGarbageVideos) // new   
vidRouter.route("/deleteManyVideos").post(deleteMultipleVieos) // new   
vidRouter.route("/setVerifyTrue/:videoId").get(verifyVideo)  //new 


export default vidRouter