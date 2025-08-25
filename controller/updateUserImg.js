import { User } from "../db/dbConfig.js"
import fs from 'fs'
import { projectRoot } from "../app.js"

const deletePhoto = async(filename) =>{
    fs.unlink(`${projectRoot}/uploads/userImg/${filename}`,(err)=>{})
}

async function updateUserImg(req,res)
{
    try
    {
        const user = await User.findOne({email:req.user.email})
        const previousImg = user.img
        user.img = req.file.filename
        await user.save()
        res.sendStatus(200)
        deletePhoto(previousImg)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default updateUserImg