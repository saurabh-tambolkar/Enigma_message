import connectDB from "@/lib/dbConnect";
import User from '@/model/User'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST(req,res){
    await connectDB();
    try {
        console.log("connected")
        let payload = await req.json();
        let {username,email,password} = payload;
        console.log(username,email)

        const existingUserVerifiedByUsername = await User.findOne({username,isVerified:true});
        if(existingUserVerifiedByUsername){
            return NextResponse.json({success:false,
                message:"Username already exists"},400)
        }

        const existingUserByEmail = await User.findOne({email});
        const verifyCode = Math.floor(100000 + Math.random()*900000).toString();
        
        if(existingUserByEmail){
            if(existingUserByEmail.isVerified){
                return NextResponse.json({success:false,message:"User already exists with this email."},{status:500})
            }
            else{
                const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000);
            await existingUserByEmail.save();
            }
        }
        else{
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const expiryDate = new Date();
            expiryDate.setDate(expiryDate.getHours() + 1);
            let user = new User({
                username,
                email,
                password:hashedPassword,
                verifyCode:verifyCode,
                verifyCodeExpiry:expiryDate,
                isVerified:false,
                isAcceptingMessages:true,
                messages:[]
            })
            await user.save();
            // return NextResponse.json({message:"User registered successfully 1 , please verify your email.",success:true},{status:200}) //to comment out
        }

            //send verification email by resend
        console.log("email sent")
        const emailResponse = await sendVerificationEmail({email, username, verifyCode});
        console.log("thisis email resp",emailResponse)
        if(emailResponse.status !== 200){
          return NextResponse.json({message:emailResponse.message,success:false},{status:410})
        }
        return NextResponse.json({message:"User registered successfully 2 , please verify your email.",success:true},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:"Error registering user"},{status:500})
    }
}