import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'

async function uploadVoiceMessage(req,res)
{
    try
    {
         const chatObject = await Chat.findOne({_id:req.body.chatId})
        const usersOnChat = await User.find({"friends.conversationId":req.body.chatId})
        const user = await User.findOne({email:req.user.email},"_id email")
        const secondUser = usersOnChat.filter(x=>x._id != user._id.toString())
        const chat = [...chatObject.content]
        chat.push({time:new Date().getTime(),message:req.file.filename,status:"sent",sender:user._id.toString(),type:'voice'})
        await Chat.findByIdAndUpdate(chatObject._id.toString(),{$set:{content:chat}},{new:true})
        io.to(sockets[user.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser[0].email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
    
}

export default uploadVoiceMessage