import { Router } from "express";
import { userSignUp,userLogin,uploadAvatar,currUser,recheck,logoutUser,changePassword,getUserChannelDetails,addToWatchHistory,getWatchHistory,remVidFromWatchHistory,clearWatchHistory} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";
import { auth } from "../middlewares/auth.js";


const router=Router()

router.route("/signUp").post(userSignUp)
router.route("/logIn").post(userLogin)
router.route("/currUser").get(auth,currUser)
router.route("/direct").get(auth,recheck)
router.route("/logout").post(auth,logoutUser)
router.route("/avatarUpload").post(auth,upload.single('pic'),uploadAvatar)
router.route("/changePass").post(auth,changePassword)
router.route("/getChannel/:id").get(getUserChannelDetails)   
router.route("/addToWatchHistory/:videoId").patch(auth,addToWatchHistory)   
router.route("/getWatchHistory").get(auth,getWatchHistory)   
router.route("/delfromWatchHistory/:id").patch(auth,remVidFromWatchHistory)   
router.route("/clearWatchHistory").patch(auth,clearWatchHistory)   
export default router