import { User } from "../db/dbConfig.js"
import { Chat } from "../db/dbConfig.js"
import { sockets,io } from "../server/expressConfig.js"

async function deleteUserInvitations(req) {
     const me = await User.findOne({email:req.user.email})
        const user = await User.findOne({_id:req.body.userId})
        const userInvited = [...user.invited]
        const userIndex = userInvited.findIndex(x=>x===me._id.toString())
        userInvited.splice(userIndex,1)
        const meInvitations = [...me.invitations]
        const myIndex = meInvitations.findIndex(x=>x===user._id.toString())
        meInvitations.splice(myIndex,1)
        me.invitations = [...meInvitations]
        user.invited = [...userInvited]
        await me.save()
        await user.save()
}

async function userInvitationModify(req,res)
{
    try
    {
        if(req.body.type === "delete")
        {   
            await deleteUserInvitations(req)
            res.sendStatus(200)
        }
        else if(req.body.type === "seen")
        {
            const me = await User.findOne({email:req.user.email})
            const myNotifications = [...me.notifications]
            const index = myNotifications.findIndex(x=>x.date === req.body.time)
            myNotifications[index].seen = true
            await User.findByIdAndUpdate(me._id.toString(),{$set:{notifications:myNotifications}},{new:true})
            io.to(sockets[req.user.email]).emit('notifySeenUpdate')
            res.sendStatus(200)
        }
        else if(req.body.type === "add")
        {
            await deleteUserInvitations(req)
            const invitedUser = await User.findOne({_id:req.body.userId})
            const me = await User.findOne({email:req.user.email})
            const myFriends = [...me.friends]
            const invitedUserFriends = [...invitedUser.friends]
            const chat = new Chat({
                content:[]
            })
            const response = await chat.save()
            const id = response._id.toString()
            myFriends.push({friendId:invitedUser._id.toString(),conversationId:id})
            invitedUserFriends.push({friendId:me._id.toString(),conversationId:id})
            me.friends = [...myFriends]
            invitedUser.friends = [...invitedUserFriends]
            const invitedUserNotifications = [...invitedUser.notifications]
             invitedUserNotifications.push({content:`Użytkownik ${me.username} dodał cię do znajomych`,type:"chat",img:me.img,date:new Date().getTime(),userId:me._id.toString(),seen:false})
            invitedUser.notifications = [...invitedUserNotifications]
            await me.save()
            await invitedUser.save()
            io.to(sockets[invitedUser.email]).emit('notify',"add")
            res.sendStatus(200)
        }
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
    
}

export default userInvitationModify