import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { verifyVideo,uploadVideo,getMyVideos,deleteMyVideo,playingVideoData,getAllVideos, searchApi, searchedVideos,deleteGarbageVideos} from "../controllers/video.controller.js";

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

vidRouter.route("/myVideos").get(getMyVideos)   
vidRouter.route("/setVerifyTrue/:videoId").get(verifyVideo)   
vidRouter.route("/delVideo/:videoId").delete(deleteMyVideo)   
vidRouter.route("/playVideo/:videoId").get(playingVideoData)   
vidRouter.route("/getVideos").get(getAllVideos)   
vidRouter.route("/search/:query").get(searchApi)   
vidRouter.route("/searchVideos/:query").get(searchedVideos)   
vidRouter.route("/deleteGarbageVideos").get(deleteGarbageVideos)   


export default vidRouter