import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"
import { gettingMyChats } from "./getMyChats.js"

async function search(req,res)
{
    try
    {
        const users = await User.find({},"name username img friends invited invitations")
        const me = await User.findOne({email:req.user.email})
        const myFriends = [...me.friends]
        const usersFiltered = users.filter(x=>{
            if(x._id.toString() !== me._id.toString())
            {
                const friendFilter = ()=>
                {
                    let isMyFriend = false
                    myFriends.forEach(y=>{
                        if(y.friendId === x._id.toString())
                        {
                            isMyFriend = true
                        }
                    })
                    return isMyFriend
                }

                if(x.invited.includes(me._id.toString()) || x.invitations.includes(me._id.toString()) || friendFilter())
                {
                    return false
                }
                else
                {
                    return true
                }
            }
            else
            {
                return false
            }
        })
        const usersAtChats = []
        for(let i = 0; i<myFriends.length;i++)
        {
            usersAtChats.push(await gettingMyChats(myFriends,i))
        }

        const searchUsers = []
        usersFiltered.forEach(x=>{
            if(x.name.toLowerCase().includes(req.params.searchValue.toLowerCase()) || x.username.toLocaleLowerCase().includes(req.params.searchValue.toLowerCase()))
            {
                searchUsers.push({_id:x._id.toString(),name:x.name,username:x.username,img:x.img})
            }
        })

        const searchChats = []

        usersAtChats.forEach(x=>{
            if(x.username.toLocaleLowerCase().includes(req.params.searchValue.toLocaleLowerCase()) || x.name.toLocaleLowerCase().includes(req.params.searchValue.toLowerCase()))
            {
                searchChats.push(x)
            }
            else if(!x.type && x.message.toLowerCase().includes(req.params.searchValue.toLowerCase()))
            {
                searchChats.push(x)
            }
        })

        const returnObject = {
            users:searchUsers.length !== 0 ?[...searchUsers]:404,
            chats:searchChats.length !== 0 ?[...searchChats]:404
        }

        res.status(200).json(returnObject)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default search