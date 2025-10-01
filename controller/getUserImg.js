import { User } from "../db/dbConfig.js"

async function getUserImg(req,res)
{
    try
    {
        const userImg = await User.findOne({email:req.user.email},'img')
        res.status(200).json({userImg:userImg.img})
    }
    catch(ex)
    {
        res.sendStatus(404)
    }
}

export default getUserImg