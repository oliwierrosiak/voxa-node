import { projectRoot } from "../app.js"

async function getVoiceMessage(req,res)
{
    try
    {
        res.sendFile(`${projectRoot}/uploads/voice-message/${req.params.file}`)
    }
    catch(ex)
    {
        console.log(ex)
        res.sendStatus(500)
    }
    
   
}

export default getVoiceMessage