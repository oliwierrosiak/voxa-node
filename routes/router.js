import express from 'express'
import registerUser from '../controller/registerUser.js'
import uploadHandler from '../middleware/uploadUserImage.js'
import loginUser from '../controller/loginUser.js'
import refreshToken from '../controller/refreshToken.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import userPhotoMiddleware from '../middleware/userPhotoMiddleware.js'
import userPhoto from '../controller/userPhoto.js'
import getUserData from '../controller/getUserData.js'
dotenv.config()

const Router = new express.Router()

Router.post('/register',uploadHandler.single("image"),registerUser)

Router.post('/login',loginUser)

Router.post('/refresh-token',refreshToken)

Router.get("/user-img",userPhotoMiddleware,userPhoto)

Router.get('/get-user-data',userPhotoMiddleware,getUserData)

export default Router