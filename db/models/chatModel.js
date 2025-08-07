import mongoose from "mongoose";

const ChatModel = new mongoose.Schema({
    content:{
        type: Array,
        default :[]
    }
})

export default ChatModel