import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'

async function updateMyNotifications(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        const myNotifications = [...me.notifications]
        const index = myNotifications.findIndex(x=>x.date === req.body.time)
        if(index == -1)
        {
            res.sendStatus(404)
        }
        myNotifications.splice(index,1)
        me.notifications = [...myNotifications]
        await me.save()
        io.to(sockets[req.user.email]).emit('notify')
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }


}

export default updateMyNotifications