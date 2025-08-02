import mongoose from "mongoose";
import dotenv from 'dotenv'
import UserSchema from "./models/userModel.js";
dotenv.config()

export const User = mongoose.model('user',UserSchema)

mongoose.connect(process.env.DATABASE)