import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"
import { s3 } from "../s3/s3Config.js"
import {io,sockets} from '../server/expressConfig.js'
import { PutObjectCommand } from "@aws-sdk/client-s3"
import fs from 'fs'
import dotenv from 'dotenv'
import path from "path"
dotenv.config()

const clearFilesTemp = async() =>
{

    const files = await fs.promises.readdir('uploads/files')
    for(const file of files)
    {
        try
        {
            await fs.promises.unlink(path.join(`uploads/files`,file))
        }
        catch(ex)
        {
        }
    }
}

async function uploadFile(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.body.chatId})
        const me = await User.findOne({email:req.user.email})
        const myFriends = [...me.friends]
        const secondUserId = myFriends.filter(x=>x.conversationId === req.body.chatId)
        const secondUser = await User.findOne({_id:secondUserId[0].friendId},"email")
        const chatContent = [...chat.content]
        chatContent.push({time:Date.now(),message:{dbName:req.file.filename,name:req.file.originalname,link:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/files/${req.file.filename}`},status:'sent',sender:me._id.toString(),type:'file'})
        await Chat.findByIdAndUpdate(chat._id.toString(),{$set:{content:chatContent}},{new:true})

        const buffer = fs.readFileSync(req.file.path)

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key:`files/${req.file.filename}`,
            Body: buffer,
            ContentType:req.file.mimetype
        })

        await s3.send(command)

        io.to(sockets[me.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser.email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        res.sendStatus(200)
        clearFilesTemp()
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
        clearFilesTemp()
    }
    
}

export default uploadFile