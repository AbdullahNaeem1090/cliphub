import { Router } from "express";
import { addToWatchHistory, clearWatchHistory, deleteVideoFromHistory, getWatchHistory } from "../controllers/watchHistory.controller.js";
const watchHistoryRouter = Router()

watchHistoryRouter.route("/addVideoToWatchHistory").post(addToWatchHistory)
watchHistoryRouter.route("/getHistory/:userId").get(getWatchHistory)
watchHistoryRouter.route("/deleteVideoFromHistory/:id").delete(deleteVideoFromHistory)
watchHistoryRouter.route("/clear/:userId").delete(clearWatchHistory)

export default watchHistoryRouter