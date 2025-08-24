import express from 'express'
import registerUser from '../controller/registerUser.js'
import uploadHandler from '../middleware/uploadUserImage.js'
import loginUser from '../controller/loginUser.js'
import refreshToken from '../controller/refreshToken.js'
import dotenv from 'dotenv'
import userAuthorizationMiddleware from '../middleware/userAuthorization.js'
import userPhoto from '../controller/userPhoto.js'
import getUserData from '../controller/getUserData.js'
import logoutUser from '../controller/logoutUser.js'
import getSuggestedUsers from '../controller/getSuggestedUsers.js'
import getUserImg from '../controller/getUserImg.js'
import invitation from '../controller/invitation.js'
import getMyInvitations from '../controller/getMyInvitations.js'
import userInvitationModify from '../controller/userInvitationModify.js'
import getMyNotifications from '../controller/getMyNotifications.js'
import updateMyNotifications from '../controller/updateMyNotifications.js'
import getMyChats from '../controller/getMyChats.js'
import getChat from '../controller/getChat.js'
import updateChat from '../controller/updateChat.js'
import messageSeen from '../controller/messageSeen.js'
import upload from '../middleware/uploadVoiceMessage.js'
import uploadVoiceMessage from '../controller/uploadVoiceMessage.js'
import getVoiceMessage from '../controller/getVoiceMessage.js'
import uploadChatImgs from '../controller/uploadChatImgs.js'
import uploadChatImg from '../middleware/uploadChatsImgs.js'
import getChatImg from '../controller/getChatImg.js'
import getChatImgsData from '../controller/getChatImgsData.js'
import fileUpload from '../middleware/uploadFile.js'
import uploadFile from '../controller/uploadFile.js'
import downloadFile from '../controller/downloadFile.js'
import search from '../controller/search.js'
import googleLogin from '../controller/googleLogin.js'

dotenv.config()

const Router = new express.Router()

Router.post('/register',uploadHandler.single("image"),registerUser)

Router.post('/login',loginUser)

Router.post('/google-login',googleLogin)

Router.post('/refresh-token',refreshToken)

Router.get("/user-img",userAuthorizationMiddleware,userPhoto)

Router.get('/get-user-data',userAuthorizationMiddleware,getUserData)

Router.post('/logout',logoutUser)

Router.get('/get-suggested-users',userAuthorizationMiddleware,getSuggestedUsers)

Router.get('/get-user-img/:img',userAuthorizationMiddleware,getUserImg)

Router.post('/invitation',userAuthorizationMiddleware,invitation)

Router.get('/get-my-invitations',userAuthorizationMiddleware,getMyInvitations)  

Router.patch('/modify-user-invitation',userAuthorizationMiddleware,userInvitationModify)

Router.get('/get-my-notifications',userAuthorizationMiddleware,getMyNotifications)

Router.patch('/update-notifications',userAuthorizationMiddleware,updateMyNotifications)

Router.get('/get-my-chats',userAuthorizationMiddleware,getMyChats)

Router.get('/get-chat/:id',userAuthorizationMiddleware,getChat)

Router.post('/update-chat',userAuthorizationMiddleware,updateChat)

Router.patch('/message-seen',userAuthorizationMiddleware,messageSeen)

Router.post('/send-voice-message',userAuthorizationMiddleware,upload.single('audio'),uploadVoiceMessage)

Router.get('/get-voice-message/:file',userAuthorizationMiddleware,getVoiceMessage)

Router.post('/upload-chat-images',userAuthorizationMiddleware,uploadChatImg.array('images',10),uploadChatImgs)

Router.get('/get-chat-img/:img',userAuthorizationMiddleware,getChatImg)

Router.get('/get-chat-imgs-data/:chatId',userAuthorizationMiddleware,getChatImgsData)

Router.post('/upload-file',userAuthorizationMiddleware,fileUpload.single('file'),uploadFile)

Router.get('/download-file/:filename',userAuthorizationMiddleware,downloadFile)

Router.get('/search/:searchValue',userAuthorizationMiddleware,search)





export default Router