import { asyncHandler } from "../utils/asyncHandler.js"
import { userModel } from "../models/user.model.js"
import { apiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefereshTokens = async (userId) => {
    try {
        const user = await userModel.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating referesh and access token")
    }
}

const auth = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken) {
        return res.status(400).json({
            message: "No access token found, please log in"
        });
    }

    try {
        console.log("access Process")
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken");
        if (!user) {
            throw new apiError(404, "User not found");
        }
        req.user = user;
        console.log("Access token is valid");
        return next();

    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {console.log("refresh process")
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await userModel.findById(decodedRefreshToken?._id);

                if (!user) {
                    throw new apiError(404, "User not found");
                }

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

                req.user = user;
                console.log("Tokens refreshed successfully");
                return next();
            } catch (refreshError) {
                return res.status(401).json({ message: "Authentication required. Please log in." });
            }
        } else {
            return res.status(401).json({ message: "Invalid access token" });
        }
    }
});

// const auth = asyncHandler(async (req, res, next) => {
//     try {
//         const token = req.cookies?.accessToken
//         if (!token) {
//             return res.json(
//                 new ApiResponse(400,{},"no token found plz login")
//             )
//         }

//         const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

//         const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken")

//         if (!user) {
//             throw new apiError(400,"No token")
//         }

//         req.user = user;
//         console.log("done")
//         next()


//     } catch (error) {
//         return res.status(401).json({ message: "Token Not found" })
//     }
// })

export { auth }