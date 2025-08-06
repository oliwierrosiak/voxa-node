import { User } from "../db/dbConfig.js"

async function getMyInvitations(req,res)
{
    try
    {
        const myInvitations = await User.findOne({email:req.user.email},"invitations")
        if(myInvitations.invitations.length > 0)
        {
            const users = []
            for(let i = 0; i<myInvitations.invitations.length;i++)
            {
                const foundUser = await User.findOne({_id:myInvitations.invitations[i]},"username img")
                users.push(foundUser)

            }

            res.status(200).json(users)
        }
        else
        {
            res.sendStatus(404)
        }
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}
export default getMyInvitations