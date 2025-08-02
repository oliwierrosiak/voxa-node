import express from 'express'
import registerUser from '../controller/registerUser.js'
import uploadHandler from '../middleware/uploadUserImage.js'
import loginUser from '../controller/loginUser.js'
import refreshToken from '../controller/refreshToken.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const Router = new express.Router()

Router.post('/register',uploadHandler.single("image"),registerUser)

Router.post('/login',loginUser)

Router.post('/refresh-token',refreshToken)

Router.get('/admin',(req,res,next)=>{
    const token = req.headers["authorization"].split(" ")[1]
    if(token)
    {
        jwt.verify(token,process.env.ACCESS_TOKEN,(err,data)=>{
            if(err)
            {
                res.sendStatus(403)
            }
            else
            {
                req.user = data
            }
        })
    }
    else
    {
        res.sendStatus(403)
    }
    next()
},(req,res)=>{
    res.json(req.user)
})

export default Router