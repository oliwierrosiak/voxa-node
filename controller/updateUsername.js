import { User } from "../db/dbConfig.js"

async function updateUsername(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        me.username = req.body.username
        await me.save()
        res.sendStatus(200)
    }
    catch(ex)
    {
        if(ex.code === 11000)
        {
            const response = {
                status:500,
                message:"Duplicated username"
            }
            res.status(500).json(response)
        }
        else
        {
            res.sendStatus(500)

        }
    }
}

export default updateUsername