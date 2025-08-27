import { ResetPassword } from "../db/dbConfig.js"
import { randomBytes} from 'crypto'
import transporter from "../helpers/mailer.js"

async function clearExpiredTokens()
{
    try
    {   
        const date = new Date()
        const tokens = await ResetPassword.find({})
        for(let i = 0;i<tokens.length;i++)
        {
            if(tokens[i].expire < date)
            {
                await ResetPassword.findByIdAndDelete(tokens[i]._id.toString())
            }
        }
    }       
    catch(ex)
    {
        console.log(ex)
    }
}

async function resetPassword(req,res)
{
    try
    {
        clearExpiredTokens()
        const token = randomBytes(16).toString('base64url')
        const date = new Date()
        const obj = new ResetPassword({
            token,
            expire:date.getTime() + 1000*60*10,
            email:req.user.email,
        })
        await obj.save()
        await transporter.sendMail({
            from:'voxa.message@gmail.com',
            to:req.user.email,
            subject:'Resetowanie hasła aplikacji Voxa',
            text:`Ktoś wymusił resetowanie hasła Twojego konta w serwisie Voxa. Jeżeli to Ty chcesz zresetować hasło, wejdź na podany link http://localhost:3000/reset-password/${token}. Na reset swojego hasła masz 10 minut. Jeżeli to nie Ty wymusiłeś zresetowanie hasła zignoruj tą wiadomość.`,
            html:`<p>Ktoś wymusił resetowanie hasła Twojego konta w serwisie Voxa.<br>Jeżeli to Ty chcesz zresetować hasło kliknij w podany link</p><br><a href="http://localhost:3000/reset-password/${token}">http://localhost:3000/reset-password/${token}</a><br><p>Na reset swojego hasła masz 10 minut.<p><br><p>Jeżeli to nie Ty wymusiłeś zresetowanie hasła zignoruj tą wiadomość.</p>`
        })
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(500)
    }
}

export default resetPassword