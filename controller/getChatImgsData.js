import { Chat } from "../db/dbConfig.js"

async function getChatImgsData(req,res)
{
    try
    {
        const chat = await Chat.findOne({_id:req.params.chatId},"content")
        const chatContent = [...chat.content]
        const imgs = []
        const chatContentFiltered = chatContent.filter(x=>x.type === "photos" || x.type === "video")
        chatContentFiltered.forEach(x=>{
            const message = [...x.message]
            message.forEach(y=>{
                imgs.push(y)
            })
        })
        res.status(200).json(imgs.sort())
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
}

export default getChatImgsData