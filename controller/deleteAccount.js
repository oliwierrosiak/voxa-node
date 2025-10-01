import bcrypt from 'bcrypt'
import { User } from '../db/dbConfig.js'
import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '../s3/s3Config.js'

async function deleteUserImg(img)
{
    try
    {
        if(img !== "https://voxa-chats.s3.eu-north-1.amazonaws.com/userImg/default.jpg")
        {
            const key = img.split('/').at(-1)
            const command = new DeleteObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key:`userImg/${key}`,
            })
            s3.send(command)
        }
    }
    catch(ex)
    {}
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
        res.sendStatus(500)
    }
}

export default deleteAccount