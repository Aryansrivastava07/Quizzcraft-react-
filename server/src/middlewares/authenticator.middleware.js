import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";


export const authenticateUser = async(req,res,next) =>{
    try {
        const accessToken = req.header("Authorization")?.replace("Bearer ","");
        if(!accessToken) throw new ApiError(400,"Unauthorized access");
        const decode = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decode._id).select("-password -refreshToken");
        if(!user.verified) throw new ApiError(400,"User not verified");
        if(!user) throw new ApiError(400,"Unauthorized access");
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        next(new ApiError(500, error?.message || "Verification unsuccessfull"));
    }
}