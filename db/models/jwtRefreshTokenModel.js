import mongoose from "mongoose";

const jwtRefreshTokenModel = new mongoose.Schema({
    refreshToken:{
        type:String
    },
    expireTime:{
        type: Number,
    }
})

export default jwtRefreshTokenModel