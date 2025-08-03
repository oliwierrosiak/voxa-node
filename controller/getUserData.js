import { User } from "../db/dbConfig.js"

async function getUserData(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email},"name email username")
        res.send({name:user.name,email:user.email,username:user.username})
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

export default getUserData