import { User } from "../db/dbConfig.js"

async function updateName(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        me.name = req.body.name
        await me.save()
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }


}

export default updateName