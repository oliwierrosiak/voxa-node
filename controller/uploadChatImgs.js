import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'
import ffmpegPath from "ffmpeg-static"
import { execFile } from 'child_process'
import sharp from "sharp"
import fs from 'fs'
import Ffmpeg from "fluent-ffmpeg"

Ffmpeg.setFfmpegPath(ffmpegPath)

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
                    filenames.push(files[i].filename)
                }
                else
                {
                    await sharp(files[i].path).resize({width:1920}).webp({quality:50}).toFile(`uploads/chat-img/${files[i].filename.split('.')[0]}.webp`)
                    filenames.push(`${files[i].filename.split('.')[0]}.webp`)
                    fs.unlinkSync(`uploads/chat-img/${files[i].filename}`)
                }
                
            }
            else
            {
                const filename = files[i].filename.split('.')[0]
                await makeScreenshot(files[i].path,`uploads/chat-img/${filename}.jpg`)
                filenames.push(`${filename}.jpg`)
                await videoCompression(files[i].path,`uploads/chat-img/${files[i].filename}`)
                fs.unlinkSync(`uploads/chat-img/video-temp/${files[i].filename}`)
            }
        }
        chatContent.push({time:Date.now(),message:filenames.sort(),status:'sent',sender:me._id.toString(),type:files.at(-1).mimetype.includes('video')?"video":"photos"})
        await Chat.findByIdAndUpdate(chat._id.toString(),{$set:{content:chatContent}},{new:true})
        io.to(sockets[me.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser.email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        

        res.sendStatus(200)

    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}


export default uploadChatImgs