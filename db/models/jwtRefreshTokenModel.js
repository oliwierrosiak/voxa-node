import mongoose from "mongoose";

const jwtRefreshTokenModel = new mongoose.Schema({
    refreshToken:{
        type:String
    }
})

export default jwtRefreshTokenModel