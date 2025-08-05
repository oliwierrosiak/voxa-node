import { User } from "../db/dbConfig.js"

async function getSuggestedUsers(req,res)
{
    try
    {
        const users = await User.find({},"username img invitations")
        const me = await User.findOne({email:req.user.email},"_id")
        const userWithoutMe = users.filter(x=>x._id.toString() != me._id.toString())
        const usersFiltered = userWithoutMe.filter(x=>{
            return !x.invitations.includes(me._id.toString())
        })
        const sendUsers = []
        if(usersFiltered.length == 0)
        {
            res.sendStatus(404)
        }
        else if(usersFiltered.length < 15)
        {
            res.status(200).json(usersFiltered)
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
        console.log(ex)
        res.sendStatus(500)
    }
}

export default getSuggestedUsers