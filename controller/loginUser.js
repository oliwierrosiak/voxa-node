import { User } from "../db/dbConfig.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { JwtRefreshToken } from "../db/dbConfig.js"
import dotenv from 'dotenv'
dotenv.config()

async function loginUser(req,res)
{
    try
    {
        const user = await User.findOne({email:req.body.email},"email password name username")
        if(user && bcrypt.compareSync(req.body.password,user.password))
        {
            const token = jwt.sign({email:user.email},process.env.ACCESS_TOKEN,{ expiresIn : "15s"})
            const refreshToken = jwt.sign({email:user.email},process.env.REFRESH_TOKEN, {expiresIn:"1h"})
            const refresh = new JwtRefreshToken({refreshToken})
            await refresh.save()
            res.status(200).json({token:token,refreshToken:refreshToken,email:user.email,name:user.name,username:user.username})
        }
        else
        {
            const error = new Error()
            error.status = 401
            throw error
        }
    }
    catch(ex)
    {
        if(ex?.status === 401)
        {
            res.status(401).json({
                status:401,
                message:"Invalid login data"
            })
        }
        else
        {
            res.sendStatus(500)
        }
    }
}

export default loginUser