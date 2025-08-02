import mongoose from "mongoose";
import dotenv from 'dotenv'
import UserSchema from "./models/userModel.js";
import jwtRefreshTokenModel from "./models/jwtRefreshTokenModel.js";
dotenv.config()

export const User = mongoose.model('user',UserSchema)

export const JwtRefreshToken = mongoose.model('jwtRefreshToken',jwtRefreshTokenModel)

mongoose.connect(process.env.DATABASE)