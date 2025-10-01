import { PutObjectCommand } from "@aws-sdk/client-s3"
import { User } from "../db/dbConfig.js"
import fs from 'fs'
import path from "path"
import sharp from "sharp"
import { s3 } from "../s3/s3Config.js"

export const clearTemp = async() =>
{

    const folderTemp = 'uploads/userImg/user-temp'
    const folder = 'uploads/userImg'
    const files = await fs.promises.readdir(folderTemp)
    const images = await fs.promises.readdir(folder)
    for(const file of files)
    {
        try
        {
            await fs.promises.unlink(path.join(folderTemp,file))

        }
        catch(ex)
        {}
    }
    for(const img of images)
    {
        try
        {
            await fs.promises.unlink(path.join(folder,img))

        }
        catch(ex)
        {}
    }
}

async function registerUser(req,res)
{
    
    try
    {
        if(req.file)
        {
            await sharp(req.file.path).resize({width:400}).webp({quality:50}).toFile(`uploads/userImg/${req.file.filename.split('.')[0]}.webp`)
            
        }
        if(req.body.username === "Unknown")
        {
            const error = {
                code:11000,
                keyValue:{username:'reserved'}
            }
            throw error
        }
        let img
        if(req.file && req.file?.filename.split('.')[0])
        {
            const buffer = fs.readFileSync(`uploads/userImg/${req.file.filename.split('.')[0]}.webp`)
            const command = new PutObjectCommand({
                Bucket:process.env.AWS_BUCKET_NAME,
                Key:`userImg/${req.file?.filename.split('.')[0]}.webp`,
                Body:buffer,
                ContentType:req.file.mimetype
            })
            await s3.send(command)
            img = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/userImg/${req.file?.filename.split('.')[0]}.webp`
        }
        else
        {
            img = "https://voxa-chats.s3.eu-north-1.amazonaws.com/userImg/default.jpg"
        }
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            username:req.body.username,
            img:img
        })

        const save = await user.save()
        res.sendStatus(200)
        clearTemp()
    }
    catch(ex)
    {
        console.log(ex)
        const response = {
            status:400,
            ok:false,
            message:"400 Invalid request - You have provided wrong data or your sent data is not complete",
            errors:{
                name:'',
                email:'',
                password:'',
                username:'',
            }
        }

        for(const key in response.errors)
        {
            if(ex.errors?.[key]?.properties?.message)
            {
                response.errors[key] = ex.errors?.[key]?.properties?.message 

            }
            else
            {
                response.errors[key] = ''
            }
        }

        if(ex.code == 11000)
        {
            for(const key in ex.keyValue)
            {
                if(key === "username")
                {
                    response.errors.username = `Nazwa jest już zajęta`
                }
                if(key === "email")
                {
                    response.errors.email = `Ten email jest już zarejestrowany`
                }
            }
        }
        clearTemp()
        res.status(400).json(response)
    }
}

export default registerUser