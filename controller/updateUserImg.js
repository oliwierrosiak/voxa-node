import { User } from "../db/dbConfig.js"
import fs from 'fs'
import { clearTemp } from "./registerUser.js"
import sharp from "sharp"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "../s3/s3Config.js"
import dotenv from 'dotenv'
dotenv.config()

const deletePhoto = async(filename) =>{
    try
    {
        if(filename != "https://voxa-chats.s3.eu-north-1.amazonaws.com/userImg/default.jpg")
        {
            const key = filename.split('/').at(-1)
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key:`userImg/${key}`,
            })
            s3.send(command)
        }
    }
    catch(ex)
    {

    }

}

async function updateUserImg(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email})
        const previousImg = user.img
        await sharp(req.file.path).resize({width:400}).webp({quality:50}).toFile(`uploads/userImg/${req.file.filename.split('.')[0]}.webp`)
        const buffer = fs.readFileSync(`uploads/userImg/${req.file.filename.split('.')[0]}.webp`)
        const command = new PutObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:`userImg/${req.file?.filename.split('.')[0]}.webp`,
            Body:buffer,
            ContentType:req.file.mimetype
        })
        await s3.send(command)
        user.img = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/userImg/${req.file?.filename.split('.')[0]}.webp`
        await user.save()
        res.sendStatus(200)
        deletePhoto(previousImg)
        clearTemp()
    }
    catch(ex)
    {
        res.sendStatus(500)
        clearTemp()
    }
}

export default updateUserImg