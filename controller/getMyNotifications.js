import { User } from "../db/dbConfig.js"

async function getMyNotifications(req,res)
{
    try
    {
        const notifications = await User.findOne({email:req.user.email},"notifications")
        res.status(200).json([...notifications.notifications].sort((a,b)=>b.date-a.date))
    }
    catch(ex)
    {

        res.sendStatus(500)
    }
}

export default getMyNotifications