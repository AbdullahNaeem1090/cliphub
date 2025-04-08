import { Router } from "express";
import { delReply, getReplies, postReply } from "../controllers/rep_comment.controller.js";

let replyCommentsRouter=Router()

replyCommentsRouter.route("/postReply").post(postReply)
replyCommentsRouter.route("/getReplies/:commentId").get(getReplies)
replyCommentsRouter.route("/deleteReply/:_id").delete(delReply)

export default replyCommentsRouter