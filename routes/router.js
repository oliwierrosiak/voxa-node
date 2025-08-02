import express from 'express'
import registerUser from '../controller/registerUser.js'
import uploadHandler from '../middleware/uploadUserImage.js'



const Router = new express.Router()

Router.post('/register',uploadHandler.single("image"),registerUser)

export default Router