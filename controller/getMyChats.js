import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"

export const gettingMyChats = async(myFriends,i)=>
{
     const user = await User.findOne({_id:myFriends[i].friendId},"img username name")
    const lastMessageObject = await Chat.findOne({_id:myFriends[i].conversationId},"content")
    const lastMessage =  lastMessageObject.content.sort((a,b)=>{return b.time - a.time})

    const userObj = user?user.toObject():{img:'default.jpg',username:'Unknown',name:'Unknown'}
    userObj.conversationId = lastMessageObject._id.toString()
    userObj.message = lastMessage[0]?.message || "Przywitaj się i rozpocznij konwersacje!"
    if(userObj.message === "Przywitaj się i rozpocznij konwersacje!")
    {
        userObj.time = lastMessageObject._id.getTimestamp()
    }
    else
    {
        userObj.time = lastMessage[0].time
    }
    if(lastMessage[0]?.sender === user?._id.toString())
    {
        userObj.seen = lastMessage[0].status
    }
    else
    {
        userObj.seen = 'seen'
    }
    if(lastMessage[0]?.type)
    {   
        userObj.type = lastMessage[0].type
    }
    userObj.sender = lastMessage[0]?.sender
    return userObj
}

async function getMyChats(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email},"friends")
        const myFriends = [...me.friends]
        const returnObject = []
        for(let i = 0 ;i<myFriends.length;i++)
        {
           returnObject.push(await gettingMyChats(myFriends,i))
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
        res.sendStatus(500)
    }
}

export default getMyChats