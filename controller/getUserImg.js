import { projectRoot } from "../app.js"

function getUserImg(req,res)
{
    try
    {
        res.sendFile(`${projectRoot}/uploads/userImg/${req.params.img}`)
    }
    catch(ex)
    {
        res.sendStatus(404)
    }
}

export default getUserImg