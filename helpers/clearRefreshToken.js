import { JwtRefreshToken } from "../db/dbConfig.js"

async function clearRefreshTokens()
{
    try
    {   
        await JwtRefreshToken.deleteMany({expireTime:{ $lt: Date.now()}})
    }
    catch(ex)
    {
        console.log(ex)
    }
}

export default clearRefreshTokens