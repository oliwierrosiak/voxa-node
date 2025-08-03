import { User } from "../db/dbConfig.js"
import { projectRoot } from "../app.js"
import path from 'path'

async function userPhoto(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email},"img")
        const pathToImg = path.join(projectRoot,`uploads/userImg/${user.img}`)
        res.sendFile(pathToImg)
    }
    catch(ex)
    {
        res.sendStatus(404)
    }
}

export default userPhoto