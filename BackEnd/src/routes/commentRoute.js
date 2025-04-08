import { Router } from "express";
import { postComment ,delComment} from "../controllers/comment.controller.js";
// import { } from "../controllers/rep_comment.controller.js";

const commentRouter = Router()


commentRouter.route("/post").post(postComment)
commentRouter.route("/removeComment/:_id").delete(delComment) 

export default commentRouter