import multer from "multer";
import path from 'path'
import { projectRoot } from "../app.js";

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'uploads/files/')
    },
    filename: (req,file,cb) =>
    {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null,Date.now()+path.extname(file.originalname))
    }
})

const fileUpload = multer({storage})

export default fileUpload