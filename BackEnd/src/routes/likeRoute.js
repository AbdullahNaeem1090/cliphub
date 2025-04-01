import { Router } from "express";
import { addLike,removeLike,likedVideos } from "../controllers/like.controller.js";
const likeRouter = Router()

likeRouter.route("/addLike").post(addLike)
likeRouter.route("/removeLike").post(removeLike)
likeRouter.route("/getLikes/:likedById").get(likedVideos)

export default likeRouter