import { User } from "../db/dbConfig.js"
import { ResetPassword } from "../db/dbConfig.js"

async function PostResetPassword(req,res)
{
    try
    {   
        const token = await ResetPassword.findOne({token:req.body.token})
        const me = await User.findOne({email:token.email})
        me.password = req.body.password
        await me.save()
        res.sendStatus(200)
    }
    catch(ex)
    {
        if(ex.errors.password.message)
        {
            res.status(500).json({message:ex.errors.password.message})
        }
        else
        {
            res.sendStatus(500)

        }
    }
}

export default PostResetPassword