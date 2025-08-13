import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"

async function getMyChats(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email},"friends")
        const myFriends = [...me.friends]
        const returnObject = []
        for(let i = 0 ;i<myFriends.length;i++)
        {
            const user = await User.findOne({_id:myFriends[i].friendId},"img username")
            const lastMessageObject = await Chat.findOne({_id:myFriends[i].conversationId},"content")
            const lastMessage =  lastMessageObject.content.sort((a,b)=>{return b.time - a.time})
            const userObj = user.toObject()
            userObj.conversationId = lastMessageObject._id.toString()
            userObj.time = lastMessageObject._id.getTimestamp()
            userObj.message = lastMessage[0]?.message || "Przywitaj się i rozpocznij konwersacje!"
            if(lastMessage[0].sender === user._id.toString())
            {
                userObj.seen = lastMessage[0].status
            }
            else
            {
                userObj.seen = 'seen'
            }
            returnObject.push(userObj)

        }
        returnObject.sort((a,b)=>b.time - a.time)
        if(returnObject.length === 0)
        {
            res.sendStatus(404)
        }
        else
        {
            res.status(200).json(returnObject)

        }
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

//ogarnac sortowanie w przypadku kiedy juz sa jakies wiadomosci na czacie

export default getMyChats