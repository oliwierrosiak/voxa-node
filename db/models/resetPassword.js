import mongoose from "mongoose";

const ResetPasswordModel = new mongoose.Schema({
    token:String,
    expire:Number,
    email:String,
})

export default ResetPasswordModel