import App from "./expressConfig.js";
import dotenv from 'dotenv'
dotenv.config()

App.listen(process.env.PORT,'0.0.0.0',()=>{
    console.log("Serwer słucha na porcie " + process.env.PORT + '...')
})