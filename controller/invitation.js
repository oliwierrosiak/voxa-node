import { User } from "../db/dbConfig.js"

async function invitation(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        const invitedUser = await User.findOne({_id:req.body.id})
        const myInvited = [...me.invited]
        const invitedUserInvitations = [...invitedUser.invitations]
        myInvited.push(invitedUser._id.toString())
        invitedUserInvitations.push(me._id.toString())
        me.invited = myInvited
        invitedUser.invitations = invitedUserInvitations
        await me.save()
        await invitedUser.save()
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default invitation