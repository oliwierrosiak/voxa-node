import { projectRoot } from "../app.js"

function downloadFile(req,res)
{
    try
    {
        res.sendFile(`${projectRoot}/uploads/files/${req.params.filename}`)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default downloadFile