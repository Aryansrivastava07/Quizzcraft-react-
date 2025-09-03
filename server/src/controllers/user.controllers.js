import { asyncHandler } from "../utils/AsyncHandler.js";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import nodemailer from "nodemailer";
import { uploadOnCludinary } from "../utils/cloudinary.js";
import { getAccessToken, getRefreshToken } from "../utils/generateJWTtoken.js";
import mongoose from "mongoose";

const userRegister = asyncHandler(async (req, res, next) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        throw new ApiError(400, "All fields are required.");
    }
    const userExists = await User.findOne({ $or: [{ username }, { email }] });
    if (userExists) {
        throw new ApiError(400, "User already exists.");
    }
    const user = await User.create({
        username,
        email,
        password
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    return res.status(201).json(new ApiResponse(
        201,
        "User registered successfully.",
        { user: userResponse },
    ));
})

const userRequestVerificationMail = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    // console.log(req.params);
    const user = await User.findById(id);
    // console.log(user);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    if (user.isVerified) {
        throw new ApiError(400, "User already verified.");
    }

    const transporter = nodemailer.createTransport({
        // Using Gmail as an example. For production, a dedicated service like SendGrid or Mailgun is recommended.
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // generated ethereal user
            pass: process.env.EMAIL_PASSWORD, // Use a Gmail "App Password" here
        },
    });
    const verificationCode = Math.floor(1000 + Math.random() * 9000);
    user.verificationId = verificationCode;
    user.verificationIdExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    await user.save();
    const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <body style="font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f4f4f4; color: #333;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <table width="600" border="0" cellspacing="0" cellpadding="20" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px;">
                        <tr>
                            <td align="center" style="padding: 20px 0; border-bottom: 1px solid #eeeeee;">
                                <h1 style="margin: 0; color: #4A90E2; font-size: 28px;">QuizCraft</h1>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px 20px;">
                                <h2 style="color: #333; font-size: 22px;">Verify Your Email Address</h2>
                                <p style="font-size: 16px; line-height: 1.5;">Hi ${user.username},</p>
                                <p style="font-size: 16px; line-height: 1.5;">
                                    Welcome to the QuizCraft community! To secure your account and get started, please use the verification code below.
                                </p>
                                <div style="background-color: #f0f8ff; border: 1px dashed #4A90E2; border-radius: 8px; text-align: center; padding: 20px; margin: 25px 0;">
                                    <p style="font-size: 16px; margin: 0 0 10px 0;">Your verification code is:</p>
                                    <p style="font-size: 36px; font-weight: bold; color: #4A90E2; letter-spacing: 5px; margin: 0;">${verificationCode}</p>
                                </div>
                                <p style="font-size: 16px; line-height: 1.5;">
                                    For your security, the code is valid for the next <strong>10 minutes</strong>.
                                </p>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding: 20px; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee;">
                                <p style="margin: 0;">© 2025 QuizCraft. All rights reserved.</p>
                                <p style="margin: 5px 0 0 0;">Sector 62, Noida, Uttar Pradesh, India</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
    const mailOptions = {
        from: `"QuizCraft" <${process.env.EMAIL}>`,
        to: user.email,
        subject: 'Verification Mail',
        html: emailHtml,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Message sent: %s', info.messageId);
        return res.status(200).json(new ApiResponse(200, "Verification Code Sent."));
    } catch (error) {
        console.error('Error sending email:', error);
        throw new ApiError(500, "Failed to send verification email. Please try again later.");
    }
})

const userVerification = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { verificationCode } = req.body;
    
    if (!verificationCode) {
        throw new ApiError(400, "Verification code is required.");
    }
    const user = await User.findById(id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }
    if(user.verificationIdExpiry < new Date()){
        throw new ApiError(400, "Verification code has expired.")
    }
    if (user.verificationId !== parseInt(verificationCode)) {
        throw new ApiError(400, "Invalid verification code.")
    }
    user.verified = true;
    user.verificationId = undefined;
    user.verificationIdExpiry = undefined;
    await user.save();
    return res.status(200).json(new ApiResponse(200, "User verified successfully."));
})

const userLogin = asyncHandler(async (req, res, next) => {
  
    const {identifier,password} = req.body;
    
    if( !identifier && !password) throw new ApiError(400,"All fields are reuired.");

    const user = await User.findOne({$or:[{username : identifier},{email : identifier}]});
    if(!user) throw new ApiError(400,"Invalid Credentials");
    if(!user.verified) throw new ApiError(400,"User not verified.");
    if(!(await user.isPasswordCorrect(password))) throw new ApiError(401,"Invalid Credentials");

    const accessToken = await getAccessToken(user);
    const refreshToken = await getRefreshToken(user);
    user.refreshToken = refreshToken;

    const updatedUser = await User.findById(user._id).select("-password -refreshToken");
    
    res.status(200).json(new ApiResponse(200, "User logged in successfully.", {
        user:updatedUser,
        accessToken,
        refreshToken
    }));
})

const userLogout = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if(!id){
        throw new ApiError(400, "Refresh token is required.");
    }
    const user = await User.findById(id);
    if(!user){
        throw new ApiError(404, "User not found.");
    }
    user.refreshToken = undefined;
    await user.save();
    res.status(200).json(new ApiResponse(200, "User logged out successfully."));
})

const userRefreshToken = asyncHandler(async (req, res, next) => {
    const { refreshToken } = req.body;
    if(!refreshToken){
        throw new ApiError(400, "Refresh token is required.");
    }
    const user = await User.findOne({refreshToken});
    if(!user){
        throw new ApiError(404, "User not found.");
    }
    const accessToken = await getAccessToken(user);
    res.status(200).json(new ApiResponse(200, "Access token refreshed successfully.", {
        accessToken
    }));
})

    



export {
    userRegister,
    userRequestVerificationMail,
    userVerification,
    userLogin,
    userLogout,
    userRefreshToken
};