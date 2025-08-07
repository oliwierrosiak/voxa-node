import mongoose from "mongoose";
import emailRegex from "../validators/emailRegex.js";
import passwordRegex from "../validators/passwordRegex.js";
import bcrypt from 'bcrypt'

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        trim:true,
        required: [true,"Podaj imię"]
    },
    email:{
        type: String,
        trim:true,
        required: [true,"Podaj adres email"],
        validate:[(email)=>emailRegex(email),"Podaj prawidłowy adres"],
        unique:true
    },
    password:{
        type: String,
        required: [true,"Podaj hasło"],
        validate: [(passwd)=>passwordRegex(passwd),"Podaj silniejsze hasło"]
    },
    username:{
        type: String,
        required: [true,"Podaj nazwę"],
        unique:true
    },
    img:{
        type: String
    },
    invitations:{
        type: Array,
        default: [],
    },
    invited:{
        type:Array,
        default:[],
    },
    notifications: {
        type: Array,
        default: [],
    },
    friends:{
        type: Array,
        default: []
    }
})

UserSchema.pre("save",function(next){
    const array = this.name.split('')
    array.forEach((x,idx) => {
        if(idx == 0)
        {
             array[idx] = x.toUpperCase()
        }
        else
        {
            array[idx] = x.toLowerCase()
        }
    });
    this.name =  array.join('')
    next()
})

UserSchema.pre('save',function(next){
    if(this.isModified('password'))
    {
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(this.password,salt)
        this.password = hash
    }
    next()
   
})

export default UserSchema