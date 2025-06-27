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
        return res.status(401).json({
            message: "No access token found, please log in"
        });
    }

    try {
        const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.findById(decodedToken?._id).select("-password -refreshToken -createdAt -updatedAt -watchHistory");
        if (!user) {
            throw new apiError(404, "User not found");
        }
        req.user = user;
        return next();

    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                const user = await userModel.findById(decodedRefreshToken?._id).select("-password -refreshToken -createdAt -updatedAt -watchHistory");

                if (!user) {
                    throw new apiError(404, "User not found");
                }

                const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
                res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true });

                req.user = user;

                return next();
            } catch (refreshError) {
                return res.status(401).json({ message: "Authentication required. Please log in." });
            }
        } else {
            return res.status(401).json({ message: "Invalid access token" });
        }
    }
});


export { auth,generateAccessAndRefereshTokens }