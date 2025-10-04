import nodeMailer from "nodemailer";
import dotenv from 'dotenv'
dotenv.config()

const transporter = nodeMailer.createTransport({
    host:process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure:false,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS,
    },
    tls: {
        rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
})

export default transporter