import { profile } from "console";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    mobileNo: { type: String, unique: true, default: "" },
    address: { type: String, default: "" },
    averageScore: { type: Number, default: 0 },
},
{
    timestamps: true
})

const User = mongoose.model("User", userSchema);

export default User;