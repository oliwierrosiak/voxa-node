import { Chat } from "../db/dbConfig.js"
import { User } from "../db/dbConfig.js"

async function getChat(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.params.id})
        const users = await User.find({"friends.conversationId":req.params.id})
        let user = users.filter(x=>x.email != req.user.email)
        if(!user[0])
        {

            user = [{img:'default.jpg',username:'Unknown',name:'Unknown'}]
        }
        res.status(200).json({chat:chat.content,user:{img:user[0].img,username:user[0].username}})
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default getChat