import { Router } from "express";
import {subscribe,unSubscribe,subscribedChannels } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.route("/subscribe").post(subscribe)
subscriptionRouter.route("/unSubscribe").post(unSubscribe)
subscriptionRouter.route("/subscribedChannels/:subscriber").get(subscribedChannels)

export default subscriptionRouter