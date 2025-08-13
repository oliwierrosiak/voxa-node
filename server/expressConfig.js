import express from 'express'
import cors from 'cors'
import Router from '../routes/router.js'
import http from 'http'
import { Server } from 'socket.io'

const App = express()

export const server = http.createServer(App)

App.use(cors({origin:[
    /^http:\/\/localhost(:\d+)?$/,
      /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
], credentials:true}))

App.use(express.json())



export const io = new Server(server,{
    cors:{
        origin:[
            /^http:\/\/localhost(:\d+)?$/,
            /^http:\/\/192\.168\.\d+\.\d+(:\d+)?$/,
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

