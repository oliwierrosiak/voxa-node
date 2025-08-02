function registerUser(req,res)
{
    console.log(req.file)
    console.log(req.body)
    res.sendStatus(200)
}

export default registerUser