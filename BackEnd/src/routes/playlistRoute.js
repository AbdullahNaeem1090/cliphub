import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import {createPlaylist,getPlaylists,addVideoToPlaylist,removeVideoFromPlaylist,getPlaylistVideos,deletePlaylist} from "../controllers/playlist.controller.js";

const playlistRouter = Router()

playlistRouter.route("/createMyPlaylist").post(createPlaylist)   
playlistRouter.route("/getPlaylists").get(getPlaylists) 
playlistRouter.route("/addVideoToPlaylist").post(addVideoToPlaylist) 
playlistRouter.route("/removeVideo/:videoId/:pl_id/:category").patch(removeVideoFromPlaylist) 
playlistRouter.route("/playlistVideos/:playlistId").get(getPlaylistVideos) 
playlistRouter.route("/deletePlaylist/:playlistId").delete(deletePlaylist) 

export default playlistRouter


