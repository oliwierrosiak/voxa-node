import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'

async function updateChat(req,res)
{
    try
    {
        const chatObject = await Chat.findOne({_id:req.body.chat})
        const usersOnChat = await User.find({"friends.conversationId":req.body.chat})
        const user = await User.findOne({email:req.user.email},"_id email")
        const secondUser = usersOnChat.filter(x=>x._id != user._id.toString())
        const chat = [...chatObject.content]
        chat.push({time:req.body.time,message:req.body.message,status:"sent",sender:user._id.toString()})
        await Chat.findByIdAndUpdate(chatObject._id.toString(),{$set:{content:chat}},{new:true})
        io.to(sockets[user.email]).emit('chatUpdate',{chat:req.body.chat})
        io.to(sockets[secondUser[0].email]).emit('chatUpdate',{type:"new",chat:req.body.chat})
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default updateChat