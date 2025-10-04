import dotenv from 'dotenv'
dotenv.config()

async function getChatImgInfo(req,res)
{
    try
    {
        const videoExtensions = ["mp4","webm","ogg","mov","avi","mkv","wmv","flv","3gp","m4v"];
        let found = false
        for( let i = 0 ;i<videoExtensions.length;i++)
        {
            if(req.params.img.includes(videoExtensions[i]))
            {
                found = true
                break
            }
        }
        if(found)
        {
            res.status(200).json({type:'video',icon:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/chat-img/${req.params.img.split('.')[0]}.webp`})

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