import mongoose from "mongoose";

let MessageSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
        required:true
    }
})

let UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,'Username is required!'],
        trim:true,
        unique:true
    },
    email:{
        type:String,
        required:[true,'Email is required!'],
        unique:true,
        match:[/.+\@.+\..+/,'Please use a valid email address']
    },
    password:{
        type:String,
        required:[true,'Password is required!'],
    },
    verifyCode:{
        type:String,
        required:[true,'Verify code is required!'],
    },
    verifyCodeExpiry:{
        type:Date,
        required:[true,'Verify code expiry is required!'],
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    isAcceptingMessages:{
        type:Boolean,
        default:true
    },
    messages:[MessageSchema]
})

const User = mongoose.models?.User || mongoose.model("User",UserSchema);
module.exports = User;
