import { server } from './expressConfig.js'
import dotenv from 'dotenv'
dotenv.config()

server.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log("Serwer słucha na porcie " + process.env.PORT + '...')
})