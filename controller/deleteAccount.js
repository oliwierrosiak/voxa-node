import bcrypt from 'bcrypt'
import { User } from '../db/dbConfig.js'
import fs from 'fs'
import { projectRoot } from '../app.js'

async function deleteUserImg(img)
{
    if(img !== "default.jpg")
    {
        fs.unlink(`${projectRoot}/uploads/userImg/${img}`,(err)=>{
        })
    }
}

async function deleteAccount(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email})
        if(bcrypt.compareSync(req.body.password,me.password))
        {
            deleteUserImg(me.img)
            await User.findByIdAndDelete(me._id.toString())
            res.sendStatus(200)
        }
        else
        {
            res.sendStatus(401)
        }
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

export default deleteAccount