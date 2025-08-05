import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

function userAuthorizationMiddleware(req,res,next)
{
    const token = req.headers["authorization"].split(" ")[1]
    if(token)
    {
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,data)=>{
            if(err)
            {
                res.sendStatus(403)
            }
            else
            {
                req.user = data
            }
        })
    }
    else
    {
        res.sendStatus(403)
    }
    next()
}

export default userAuthorizationMiddleware
