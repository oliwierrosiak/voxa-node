import { User } from "../db/dbConfig.js"

async function getProfile(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email},'email username img name')
        res.status(200).json(user)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default getProfile