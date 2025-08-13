import { Chat, User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'

async function messageSeen(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.body.chatId})
        const me = await User.findOne({email:req.user.email},"_id email")
        const usersOnChat = await User.find({"friends.conversationId":req.body.chatId})
        const secondUser = usersOnChat.filter(x=>x._id != me._id.toString())
        const chatContent = [...chat.content]
        let hasUpdated = false
        chatContent.forEach(x=>{
            if(x.sender != me._id.toString())
            {
                if(x.status === "sent")
                {
                    hasUpdated = true
                }
                return x.status = "seen"
            }
        })
        await Chat.findByIdAndUpdate(chat._id.toString(),{$set:{content:chatContent}},{new:true})
        if(hasUpdated)
        {
            io.to(sockets[secondUser[0].email]).emit('chatUpdate',{chat:req.body.chatId,type:'seen'})
            io.to(sockets[me.email]).emit('chatUpdate',{chat:'all',type:'refresh'})
        }
        res.sendStatus(200)
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

export default messageSeen