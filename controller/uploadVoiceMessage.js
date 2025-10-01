import { PutObjectCommand } from "@aws-sdk/client-s3"
import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'
import fs from 'fs'
import dotenv from 'dotenv'
import path from "path"
import { s3 } from "../s3/s3Config.js"
dotenv.config()

const clearVoiceMessageTemp = async() =>
{
    const files = await fs.promises.readdir('uploads/voice-message')
    for(const voice of files)
    {
        try
        {
            await fs.promises.unlink(path.join(`uploads/voice-message`,voice))
        }
        catch(ex){}
    }
}

async function uploadVoiceMessage(req,res)
{
    try
    {
        const chatObject = await Chat.findOne({_id:req.body.chatId})
        const usersOnChat = await User.find({"friends.conversationId":req.body.chatId})
        const user = await User.findOne({email:req.user.email},"_id email")
        const secondUser = usersOnChat.filter(x=>x._id != user._id.toString())
        const chat = [...chatObject.content]
        chat.push({time:new Date().getTime(),message:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/voice-message/${req.file.filename}`,status:"sent",sender:user._id.toString(),type:'voice'})
        await Chat.findByIdAndUpdate(chatObject._id.toString(),{$set:{content:chat}},{new:true})
        const buffer = fs.readFileSync(req.file.path)
        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`voice-message/${req.file.filename}`,
            Body:buffer,
            ContentType:req.file.mimetype,
        })
        await s3.send(command)
        io.to(sockets[user.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser[0].email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        res.sendStatus(200)
        clearVoiceMessageTemp()
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
        clearVoiceMessageTemp()
    }
    
}

export default uploadVoiceMessage