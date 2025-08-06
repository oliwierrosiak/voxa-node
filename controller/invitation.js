import { User } from "../db/dbConfig.js"

async function invitation(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        const invitedUser = await User.findOne({_id:req.body.id})
        if(me.invited.includes(invitedUser._id.toString()))
        {
            res.status(200).json({info:"user already invited"})
        }
        else
        {
            if(me.invitations.includes(invitedUser._id.toString()))
            {
                res.status(200).json({info:'user already invited me'})
            }
            else
            {
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
        }
        
        
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

export default invitation