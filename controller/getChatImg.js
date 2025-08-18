import { projectRoot } from "../app.js"

function getChatImg(req,res)
{
    try
    {
        res.sendFile(`${projectRoot}/uploads/chat-img/${req.params.img}`)

    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default getChatImg