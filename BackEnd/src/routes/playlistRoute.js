import { Router } from "express";
import { upload } from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.js";

import {createPlaylist,getPlaylists,addVideoToPlaylist,removeVideoFromPlaylist,getPlaylistVideos,deletePlaylist,getPLThumbnail} from "../controllers/playlist.controller.js";

const playlistRouter = Router()

playlistRouter.route("/createMyPlaylist").post(auth,createPlaylist)   
playlistRouter.route("/getPlaylists/:userId").get(getPlaylists) 
playlistRouter.route("/addVideoToPlaylist").post(auth ,addVideoToPlaylist) 
playlistRouter.route("/removeVideo/:videoId/:playlistId").patch(removeVideoFromPlaylist) 
playlistRouter.route("/playlistVideos/:playlistId").get(getPlaylistVideos) 
playlistRouter.route("/getPLThumbnail/:playlistId").get(getPLThumbnail) 
playlistRouter.route("/deletePlaylist/:playlistId").delete(deletePlaylist) 

export default playlistRouter


