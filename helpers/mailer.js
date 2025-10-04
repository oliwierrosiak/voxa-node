import nodeMailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure:false,
    auth:{
        user:process.env.gmail_user,
        pass:process.env.gmail_password,
    },
    tls:
    {
        rejectUnauthorized: false
    },
    connectionTimeout: 10000,
})

export default transporter