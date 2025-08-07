import { User } from "../db/dbConfig.js"

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
        else if(req.body.type === "add")
        {
            await deleteUserInvitations(req)
            res.sendStatus(200)
        }
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
    
}

export default userInvitationModify