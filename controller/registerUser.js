import { User } from "../db/dbConfig.js"
import fs from 'fs'
import sharp from "sharp"

async function registerUser(req,res)
{
    
    try
    {
        if(req.file)
        {
            await sharp(req.file.path).resize({width:400}).webp({quality:50}).toFile(`uploads/userImg/${req.file.filename.split('.')[0]}.webp`)
            fs.unlinkSync(req.file.path)
        }
        if(req.body.username === "Unknown")
        {
            const error = {
                code:11000,
                keyValue:{username:'reserved'}
            }
            throw error
        }
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            username:req.body.username,
            img:`${req.file?.filename.split('.')[0]}.webp` || "default.jpg"
        })

        const save = await user.save()
        res.sendStatus(200)
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
        if(req.file?.filename)
        {
            fs.unlink(`${req.file.path}`,(err)=>{})
        }
        res.status(400).json(response)
    }
}

export default registerUser