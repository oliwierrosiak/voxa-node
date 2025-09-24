import { Chat } from "../db/dbConfig.js"
import fs from 'fs'

async function getChatImgsData(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.params.chatId},"content")
        const chatContent = [...chat.content]
        const imgs = []
        const chatContentFiltered = chatContent.filter(x=>x.type === "photos" || x.type === "video")

        const videoExtensions = ["mp4","webm","ogg","mov","avi","mkv","wmv","flv","3gp","m4v"];
        const files = await fs.promises.readdir('uploads/chat-img')

        for(let i=0;i<chatContentFiltered.length;i++)
        {
            const message = [...chatContentFiltered[i].message]
             for(let j = 0;j<message.length;j++)
            {
                const searchingValue = message[j].split('.')
                let found = false
                for(let k = 0;k<files.length;k++)
                {
                    const name = files[k].split('.')
                    if(name[0] === searchingValue[0] && videoExtensions.includes(name[1]))
                    {
                        imgs.push(name.join('.'))
                        found = true
                    
                    }
                }
                if(!found)
                {
                    imgs.push(message[j])
                }
            }
        }
        res.status(200).json(imgs.sort())
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default getChatImgsData