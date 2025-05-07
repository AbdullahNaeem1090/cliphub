import express from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser"

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

import router from './routes/userRoute.js'
app.use("/api/user",router)

import vidRouter from './routes/videoRoute.js'
app.use("/api/video",vidRouter)

import playlistRouter from './routes/playlistRoute.js'
app.use("/api/playlist",playlistRouter)

import commentRouter from './routes/commentRoute.js'
app.use("/api/comment",commentRouter)

import replyCommeRouter from './routes/replyCommentsRoute.js'
app.use("/api/replyComments",replyCommeRouter)

import subscriptionRouter from './routes/subscriptionRoute.js'
app.use("/api/subscription",subscriptionRouter)

import likeRouter from './routes/likeRoute.js'
app.use("/api/like",likeRouter)

import watchHistoryRouter from './routes/watchHistoryRoute.js'
app.use("/api/watchHistory",watchHistoryRouter)

export default app



