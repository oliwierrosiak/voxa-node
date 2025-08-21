import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"
import {io,sockets} from '../server/expressConfig.js'
async function uploadFile(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.body.chatId})
        const me = await User.findOne({email:req.user.email})
        const myFriends = [...me.friends]
        const secondUserId = myFriends.filter(x=>x.conversationId === req.body.chatId)
        const secondUser = await User.findOne({_id:secondUserId[0].friendId},"email")
        const chatContent = [...chat.content]
        chatContent.push({time:Date.now(),message:{dbName:req.file.filename,name:req.file.originalname},status:'sent',sender:me._id.toString(),type:'file'})
        await Chat.findByIdAndUpdate(chat._id.toString(),{$set:{content:chatContent}},{new:true})
        io.to(sockets[me.email]).emit('chatUpdate',{chat:req.body.chatId})
        io.to(sockets[secondUser.email]).emit('chatUpdate',{type:"new",chat:req.body.chatId})
        res.sendStatus(200)
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
    
}

export default uploadFile