import express from 'express'
import cors from 'cors'
import Router from '../routes/router.js'
import http from 'http'
import { Server } from 'socket.io'

const App = express()

export const server = http.createServer(App)

App.use(cors({origin:[
    'https://voxa-chats.web.app',
    'https://voxa-chats.firebaseapp.com',
    'http://localhost:3000'
], credentials:true}))

App.use(express.json())



export const io = new Server(server,{
    cors:{
        origin:[
            'https://voxa-chats.web.app',
            'https://voxa-chats.firebaseapp.com',
            'http://localhost:3000'
        ],
        methods:['GET','POST'],
        credentials:true
    }
})

export let sockets = {}

io.on('connection',(socket)=>{
    socket.on('login',(email)=>{
        sockets[email] = socket.id
    })

    socket.on('disconnect',()=>{
        for(const i in sockets)
        {
            if(sockets[i] === socket.id)
            {
                delete sockets[i]
            }
        }
    })
})

App.use(Router)

export default App

