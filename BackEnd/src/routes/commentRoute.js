import { Router } from "express";
import { postComment ,delComment} from "../controllers/comment.controller.js";
import { postReply,delReply } from "../controllers/rep_comment.controller.js";
// import { } from "../controllers/rep_comment.controller.js";

const commentRouter = Router()


commentRouter.route("/post").post(postComment)
commentRouter.route("/postReply").post(postReply) 
commentRouter.route("/removeComment/:_id").delete(delComment) 
commentRouter.route("/removeReply/:_id").delete(delReply) 

export default commentRouter