import nodeMailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure:true,
    auth:{
        user:process.env.gmail_user,
        pass:process.env.gmail_password,
    },
    tls:
    {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
    logger:true,
    debug:true,
})

export default transporter