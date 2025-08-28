import { User } from "../db/dbConfig.js"
import fs from 'fs'

async function registerUser(req,res)
{
    
    try
    {
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
            img:req.file?.filename || "default.jpg"
        })

        const save = await user.save()
        res.sendStatus(200)
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
            fs.unlink(`uploads/userImg/${req.file.filename}`,(err)=>{})
        }
        res.status(400).json(response)
    }
}

export default registerUser