import { ResetPassword } from "../db/dbConfig.js"

async function getResetPasswordToken(req,res)
{
    try
    {
        const token = await ResetPassword.findOne({token:req.params.token})
        const date = new Date()
        if(token && token.expire > date.getTime())
        {
            res.sendStatus(200)
        }
        else
        {
            const error = {message:'token expired'}
            throw error
        }
    }
    catch(ex)
    {
        if(ex.message === 'token expired')
        {
            res.sendStatus(401)
        }
        else
        {
            res.sendStatus(500)
        }
    }
}

export default getResetPasswordToken