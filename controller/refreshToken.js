import jwt from "jsonwebtoken"
import { JwtRefreshToken } from "../db/dbConfig.js"
import dotenv from 'dotenv'
import clearRefreshTokens from "../helpers/clearRefreshToken.js"
dotenv.config()

async function refreshToken (req,res)
{
    const { token } = req.body
    try
    {
        await clearRefreshTokens()
        
        const refresh = await JwtRefreshToken.findOne({refreshToken:token})
        if(refresh.refreshToken === token)
        {
            jwt.verify(token,process.env.REFRESH_TOKEN,(err,data)=>{
                if(err)
                {
                    res.sendStatus(403)
                }
                else
                {
                    const newAccessToken = jwt.sign({email:data.email},process.env.ACCESS_TOKEN,{expiresIn:"15s"})
                    res.json({token:newAccessToken})
                }
            })
        }
        else
        {
            res.sendStatus(403)
        }
    }
    catch(ex)
    {
        res.sendStatus(403)
    }
}

export default refreshToken