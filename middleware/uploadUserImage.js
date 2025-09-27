import multer from "multer";
import path from 'path'

const storage = multer.diskStorage({
    destination: (req,res,cb)=>{
        cb(null,'uploads/userImg/user-temp')
    },
    filename: (req,file,cb)=>{
        cb(null,Date.now() + path.extname(file.originalname))
    }
})

const uploadHandler = multer({storage})

export default uploadHandler