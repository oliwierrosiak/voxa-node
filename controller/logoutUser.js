import { JwtRefreshToken } from "../db/dbConfig.js"

async function logoutUser(req,res)
{
    try
    {
        const response = await JwtRefreshToken.deleteOne({refreshToken:req.body.token})
        res.send(200)
    }
    catch(ex)
    {   
        res.send(500)
    }
}

export default logoutUser