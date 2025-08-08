import { User } from "../db/dbConfig.js"

async function getMyChats(req,res)
{
    try
    {
        const me = await User.findOne({email:req.user.email},"friends")
        const myFriends = [...me.friends]
        const returnObject = []
        for(let i = 0 ;i<myFriends.length;i++)
        {
            const user = await User.findOne({_id:myFriends[i].friendId},"img username")
            returnObject.push(user)

        }
        console.log(returnObject)
    }
    catch(ex)
    {
        console.log(ex)
    }
}

//tworze funkcje która zwraca do zakładki aside odpowiedni obiekt. Obiekt ten musi zwrocic img, username (to juz jest) dodatkowo musi zwrocic ostatnia wiadomosc z czatu uzytkownika

export default getMyChats