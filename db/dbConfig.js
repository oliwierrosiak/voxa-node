import mongoose from "mongoose";
import dotenv from 'dotenv'
import UserSchema from "./models/userModel.js";
import jwtRefreshTokenModel from "./models/jwtRefreshTokenModel.js";
import ChatModel from "./models/chatModel.js";
dotenv.config()

export const User = mongoose.model('user',UserSchema)

export const JwtRefreshToken = mongoose.model('jwtRefreshToken',jwtRefreshTokenModel)

export const Chat = mongoose.model('chat',ChatModel)

mongoose.connect(process.env.DATABASE)