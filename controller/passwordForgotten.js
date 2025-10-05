import { User } from "../db/dbConfig.js"
import { clearExpiredTokens } from "./resetPassword.js"
import { ResetPassword } from "../db/dbConfig.js"
import { randomBytes } from "crypto"
import brevo from '@getbrevo/brevo'

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
        const client = new brevo.TransactionalEmailsApi();
        client.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);
        const email = {
            sender:{email:'voxa.message@gmail.com',name:"Voxa-Chats"},
            to: [{ email: user.email }],
            subject: 'Resetowanie hasła aplikacji Voxa',
            htmlContent: `<p>Ktoś wymusił resetowanie hasła Twojego konta w Voxa.</p>
            <a href="http://voxa-chats.web.app/reset-password/${token}">http://voxa-chats.web.app/reset-password/${token}</a>
            <p>Masz 10 minut na reset. Jeśli to nie Ty, zignoruj wiadomość.</p>
        `}
        await client.sendTransacEmail(email);
        }
        res.sendStatus(200)
    }
    catch(ex)
    {
        res.sendStatus(200)
    }
    
}

export default passwordForgotten