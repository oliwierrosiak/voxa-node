import mongoose from "mongoose";

const jwtRefreshTokenModel = new mongoose.Schema({
    refreshToken:{
        type:String
    },
    expireTime:{
        type: Number,
        default: Date.now() + 3600000
    }
})

export default jwtRefreshTokenModel