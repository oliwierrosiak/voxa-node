import { User } from "../db/dbConfig.js"
import { io, sockets } from "../server/expressConfig.js"

async function getSuggestedUsers(req,res)
{
    try
    {
        const users = await User.find({},"username img invitations invited email friends")
        const me = await User.findOne({email:req.user.email},"_id invitations")
        const userWithoutMe = users.filter(x=>x._id.toString() != me._id.toString())
        const invitationsFiltered = userWithoutMe.filter(x=>{
            return !x.invitations.includes(me._id.toString())
        })
    
        const usersWithoutInvited = invitationsFiltered.filter(x=>{
            return !x.invited.includes(me._id.toString())
        })

        const usersFiltered = usersWithoutInvited.filter(x=>{
             return !x.friends.some(friend => friend.friendId === me._id.toString());
        })

        const sendUsers = []

        if(usersFiltered.length == 0)
        {
            res.sendStatus(404)
        }
        else if(usersFiltered.length < 15)
        {
            for(let i = 0;i<usersFiltered.length;i++)
            {
                const random = Math.floor(Math.random()*usersFiltered.length)
                let repeated = false
                sendUsers.forEach((x)=>{
                    if(x._id.toString() === usersFiltered[random]._id.toString())
                    {
                        repeated = true
                    }
                })
                if(repeated)
                {
                    i--
                }
                else
                {
                    sendUsers.push(usersFiltered[random])
                }
            }
            res.status(200).json(sendUsers)
        }
        else
        {
            for(let i = 0;i<15;i++)
            {
                const random = Math.floor(Math.random()*15)
                let repeated = false
                sendUsers.forEach((x)=>{
                    if(x._id.toString() === usersFiltered[random]._id.toString())
                    {
                        repeated = true
                    }
                })
                if(repeated)
                {
                    i--
                }
                else
                {
                    sendUsers.push(usersFiltered[random])
                }
            }
            
            res.status(200).json(sendUsers)
        }
        
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default getSuggestedUsers