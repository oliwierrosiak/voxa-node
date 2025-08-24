import { OAuth2Client } from "google-auth-library"
import { User } from "../db/dbConfig.js"
import axios from "axios"
import fs from 'fs'
import { projectRoot } from "../app.js"
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import { JwtRefreshToken } from "../db/dbConfig.js"
dotenv.config()

async function registerUser(payload,usernameExist,userPhoto)
{
    const user = new User({
        name:payload.name,
        email:payload.email,
        password:`ZAQ!2wsx`,
        username:usernameExist?`GoogleUser-${Math.floor(Math.random()*1000)}`:payload.given_name,
        img:userPhoto?userPhoto:'default.jpg'
    })
    await user.save()

}

async function getUserPhoto(link)
{
    try
    {
        const userPhoto = await axios.get(link,{responseType:'stream'})
        const fileName = `${Date.now()}.jpg`
        const writer = fs.createWriteStream(`${projectRoot}/uploads/userImg/${fileName}`)
        userPhoto.data.pipe(writer)
        return new Promise((resolve,reject)=>{
            writer.on("finish",()=>{
                resolve(fileName)
            })
            writer.on('error',()=>{
                reject(null)
            })
        })
    }
    catch(ex)
    {
        console.log(ex)
    }   
}

async function login(payload) {
    const user = await User.findOne({email:payload.email},"_id email name username")
    const token = jwt.sign({email:payload.email},process.env.ACCESS_TOKEN,{ expiresIn : "15s"})
    const refreshToken = jwt.sign({email:payload.email},process.env.REFRESH_TOKEN, {expiresIn:"1h"})
    const refresh = new JwtRefreshToken({refreshToken})
    await refresh.save()
    return {token,refreshToken,id:user._id.toString(),name:user.name,username:user.username,email:user.email}
}

async function googleLogin(req,res)
{
    try
    {
        const googleClient = new OAuth2Client('294845836411-uisma3kqknrvl4a1veghuvdt1j1dun1t.apps.googleusercontent.com')

        const ticket = await googleClient.verifyIdToken({
            idToken: req.body.token,
            audience:'294845836411-uisma3kqknrvl4a1veghuvdt1j1dun1t.apps.googleusercontent.com'
        })

        const payload = ticket.getPayload()
        

        const user = await User.findOne({email:payload.email})
        if(user)
        {
            const obj = await login(payload)
            res.status(200).json({token:obj.token,refreshToken:obj.refreshToken,email:obj.email,name:obj.name,username:obj.username,id:obj.id})
        }
        else
        {
            const username = await User.findOne({username:payload.given_name})
            const userPhoto = await getUserPhoto(payload.picture)

            if(username)
            {
                await registerUser(payload,true,userPhoto)
                const obj = await login(payload)
                 res.status(200).json({token:obj.token,refreshToken:obj.refreshToken,email:obj.email,name:obj.name,username:obj.username,id:obj.id})
                
            }
            else
            {
                await registerUser(payload,false,userPhoto)
                const obj = await login(payload)
                res.status(200).json({token:obj.token,refreshToken:obj.refreshToken,email:obj.email,name:obj.name,username:obj.username,id:obj.id})
            }
        }
    }
    catch(ex)
    {
        res.sendStatus(401)
    }
    
}

export default googleLogin