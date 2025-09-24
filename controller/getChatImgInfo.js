import fs from 'fs'

async function getChatImgInfo(req,res)
{
    try
    {
        const videoExtensions = ["mp4","webm","ogg","mov","avi","mkv","wmv","flv","3gp","m4v"];
        const files = await fs.promises.readdir('uploads/chat-img')
        const searchingValue = req.params.img.split('.')[0]
        let found = false
        files.forEach(x=>{
            const value = x.split('.')
            if(value[0] === searchingValue && videoExtensions.includes(value[1]))
            {
                found = true
            }
        })
        if(found)
        {
            res.status(200).json({type:'video'})

        }
        else
        {
            res.sendStatus(200)

        }
    }
    catch(ex)
    {
        res.sendStatus(200)
    }
    
}

export default getChatImgInfo