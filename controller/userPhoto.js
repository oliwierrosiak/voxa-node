import { User } from "../db/dbConfig.js"
import { projectRoot } from "../app.js"
import path from 'path'

async function userPhoto(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email},"img")
        res.status(200).json({userImg:user.img})
    }
    catch(ex)
    {
        res.sendStatus(404)
    }
}

export default userPhoto