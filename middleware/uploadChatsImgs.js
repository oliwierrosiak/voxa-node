import multer from "multer";
import { projectRoot } from "../app.js";
import path from 'path'

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        if(file.mimetype.includes('image'))
        {
            cb(null,`${projectRoot}/uploads/chat-img/`)

        }
        else
        {
            cb(null,`${projectRoot}/uploads/chat-img/video-temp/`)
        }
    },
    filename:(req,file,cb)=>{
        const time = Date.now()
        req.time = time
        cb(null,Date.now()+path.extname(file.originalname))
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