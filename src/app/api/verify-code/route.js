import User from '@/model/User'
import connectDB from '@/lib/dbConnect'
import { NextResponse } from 'next/server';
import { verifySchema } from '@/schemas/verfiySchema';
import {z} from 'zod'

const verifyCodeSchema = z.object({
    code:verifySchema
})

export async function POST(req){
    await connectDB();
    try {
        let payload = await req.json();
        let {username,code} = payload;
        console.log('this is code',payload)

        let user = await User.findOne({username});
        if(!user){
            return NextResponse.json({message:"user not found",success:false})
        }
        else{
            console.log(code)
            let isCodeValid = user.verifyCode === code;
            let isCodeNotExpired = new Date(user.verifyCodeExpiry) < new Date();

            if(isCodeValid && isCodeNotExpired){
                user.isVerified = true;
                await user.save();
                return NextResponse.json({message:"Account is verified successfully",success:204})
            }
            else if(!isCodeNotExpired){
                return NextResponse.json({message:"Code is expired , please signup to get new code.",success:false})
            }
            else{
                return NextResponse.json({message:"Code is invalid , please signup to get new code.",success:false})
            }
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:"error verifying user.",success:false},{status:500})
    }
}