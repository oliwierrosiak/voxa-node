import { User } from "../db/dbConfig.js"
import fs from 'fs'
import path from "path"
import sharp from "sharp"

const clearTemp = async() =>
{
    try
    {
        const folder = 'uploads/userImg/user-temp'
        const files = await fs.promises.readdir(folder)
        for(const file of files)
        {
            await fs.promises.unlink(path.join(folder,file))
        }

    }
    catch(ex)
    {
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
            img = `${req.file?.filename.split('.')[0]}.webp`
        }
        else
        {
            img = "default.jpg"
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
        if(req.file?.filename)
        {
            fs.unlink(`${req.file.path}`,(err)=>{})
            fs.unlink(`uploads/userImg/${req.file.filename.split(".")[0]}.webp`,(err)=>{})
        }
        res.status(400).json(response)
    }
}

export default registerUser