import { User } from "../db/dbConfig.js"
import { clearExpiredTokens } from "./resetPassword.js"
import { ResetPassword } from "../db/dbConfig.js"
import transporter from "../helpers/mailer.js"
import { randomBytes } from "crypto"

async function passwordForgotten(req,res)
{
    try
    {
        const user = await User.findOne({email:req.body.email},"email")
        if(user)
        {
            clearExpiredTokens()
            const token = randomBytes(16).toString('base64url')
            const date = new Date()
            const obj = new ResetPassword({
                token,
                expire:date.getTime() + 1000*60*10,
                email:user.email,
            })
        await obj.save()
        await transporter.sendMail({
            from:'voxa.message@gmail.com',
            to:user.email,
            subject:'Resetowanie hasła aplikacji Voxa',
            text:`Ktoś wymusił resetowanie hasła Twojego konta w serwisie Voxa. Jeżeli to Ty chcesz zresetować hasło, wejdź na podany link http://localhost:3000/reset-password/${token}. Na reset swojego hasła masz 10 minut. Jeżeli to nie Ty wymusiłeś zresetowanie hasła zignoruj tą wiadomość.`,
            html:`<p>Ktoś wymusił resetowanie hasła Twojego konta w serwisie Voxa.<br>Jeżeli to Ty chcesz zresetować hasło kliknij w podany link</p><br><a href="http://localhost:3000/reset-password/${token}">http://localhost:3000/reset-password/${token}</a><br><p>Na reset swojego hasła masz 10 minut.<p><br><p>Jeżeli to nie Ty wymusiłeś zresetowanie hasła zignoruj tą wiadomość.</p>`
        })
        }
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(200)
    }
    
}

export default passwordForgotten