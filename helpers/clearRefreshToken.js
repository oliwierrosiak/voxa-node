import { JwtRefreshToken } from "../db/dbConfig.js"

async function clearRefreshTokens()
{
    try
    {   
        const date = new Date()
        await JwtRefreshToken.deleteMany({expireTime:{ $lt:date.getTime()}})
    }
    catch(ex)
    {
    }
}

export default clearRefreshTokens