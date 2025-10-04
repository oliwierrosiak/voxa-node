import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'
import ffmpegPath from "ffmpeg-static"
import { execFile } from 'child_process'
import sharp from "sharp"
import fs from 'fs'
import Ffmpeg from "fluent-ffmpeg"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import dotenv from 'dotenv'
import { s3 } from "../s3/s3Config.js"
import path from "path"
dotenv.config()
Ffmpeg.setFfmpegPath(ffmpegPath)

const clearTemp = async() =>{

    const folder = 'uploads/chat-img'
    const tempFolder = 'uploads/chat-img/video-temp'
    const files = await fs.promises.readdir(folder)
    const tempVideo = await fs.promises.readdir(tempFolder)
    for(const file of files)
    {
        try
        {
            await fs.promises.unlink(path.join(folder,file))
        }
        catch(ex){}
    }
    for(const file of tempVideo)
    {
        try
        {
            await fs.promises.unlink(path.join(tempFolder,file))
        }
        catch(ex){}
    }

}

const videoCompression =(inputPath,outputPath) =>
{
    return new Promise((resolve, reject) => {
    Ffmpeg(inputPath)
      .outputOptions([
        "-vcodec libx264",
        "-crf 25",
        "-preset veryfast",
        "-acodec aac",
        "-b:a 128k",
        "-movflags +faststart"
      ])
      .save(outputPath)
      .on("end", () => resolve(outputPath))
      .on("error", (err) => reject(err));
  });
}

const makeScreenshot = (videoPath,outputPath) =>{
    return new Promise((resolve,reject)=>{
        execFile(
            ffmpegPath,
            [
            "-ss", "00:00:02",
            "-i", videoPath,
            "-frames:v", "1",
            "-q:v", "2", 
            outputPath
      ],
      (err) => {
        if (err) return reject(err);
        resolve(outputPath);
      }
    );
    })
}

const uploadToAWS = async(file,name,mimetype) =>
{
    const buffer = fs.readFileSync(file)
    const command = new PutObjectCommand({
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:name,
        Body:buffer,
        ContentType:mimetype
    })

    await s3.send(command)
}

async function uploadChatImgs(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.body.chatId})
        const me = await User.findOne({email:req.user.email},"_id friends email")
        const myFriends = [...me.friends]
        const secondUserId = myFriends.filter(x=>x.conversationId === req.body.chatId)
        const secondUser = await User.findOne({_id:secondUserId[0].friendId},"email")
        const chatContent = [...chat.content]
        const files = [...req.files]
        const filenames = []
        for(let i = 0;i<files.length;i++)
        {
            if(files[i].mimetype.includes('image'))
            {
                if(files[i].filename.split('.')[1] === "webp")
                {
                    await uploadToAWS(`uploads/chat-img/${files[i].filename}`,`chat-img/${files[i].filename}`,'image/webp')
                    filenames.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/chat-img/${files[i].filename.split('.')[0]}.webp`)
                }
                else
                {
                    await sharp(files[i].path).resize({width:1920}).webp({quality:50}).toFile(`uploads/chat-img/${files[i].filename.split('.')[0]}.webp`)
                    await uploadToAWS(`uploads/chat-img/${files[i].filename}`,`chat-img/${files[i].filename.split('.')[0]}.webp`,'image/webp')
                    filenames.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/chat-img/${files[i].filename.split('.')[0]}.webp`)
                }
            }
            else
            {
                const filename = files[i].filename.split('.')[0]
                await makeScreenshot(files[i].path,`uploads/chat-img/${filename}.jpg`)
                await sharp(`uploads/chat-img/${filename}.jpg`).resize({width:1920}).webp({quality:50}).toFile(`uploads/chat-img/${files[i].filename.split('.')[0]}.webp`)
                await uploadToAWS(`uploads/chat-img/${files[i].filename.split('.')[0]}.webp`,`chat-img/${files[i].filename.split('.')[0]}.webp`,"image/webp")
                await videoCompression(files[i].path,`uploads/chat-img/${files[i].filename}`)
                await uploadToAWS(`uploads/chat-img/${files[i].filename}`,`chat-img/${files[i].filename}`,files[i].mimetype)
                filenames.push(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/chat-img/${files[i].filename}`)
            }
        }
        chatContent.push({time:Date.now(),message:filenames.sort(),status:'sent',sender:me._id.toString(),type:files.at(-1).mimetype.includes('video')?"video":"photos"})
        await Chat.findByIdAndUpdate(chat._id.toString(),{$set:{content:chatContent}},{new:true})
        io.to(sockets[me.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser.email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        clearTemp()

        res.sendStatus(200)

    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}


export default uploadChatImgs