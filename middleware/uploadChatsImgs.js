import multer from "multer";
import { projectRoot } from "../app.js";
import path from 'path'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,`${projectRoot}/uploads/chat-img/`)
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+Math.floor(Math.random()*10000)+path.extname(file.originalname))
    }
})

const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith("image/") || file.mimetype.startsWith("video/"))
    {
        cb(null,true)
    }
    else{
        const error = new Error()
        error.status = 404
        error.message = `Invalid file type`
        cb(error,false)
    }
}

const upload = multer({storage,fileFilter})

export default upload