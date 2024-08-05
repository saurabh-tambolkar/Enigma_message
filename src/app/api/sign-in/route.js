import User from '@/model/User'
import bcrypt from 'bcryptjs'
import connectDB from '@/lib/dbConnect'
import { NextResponse } from 'next/server';

export async function POST(req){
    await connectDB();
    try {
        const payload = await req.json();
        const { email, password } = payload;
        let user = await User.findOne({email})
        if(!user){
            return NextResponse.json({message:"User not found",success:false},{status:405})
        }
        let isMatchedPassword = await bcrypt.compare(password,user.password)
        if(isMatchedPassword){
            return NextResponse.json({message:"Logged in successfuly",success:true},{status:202})
        }
        else{
            return NextResponse.json({message:"credentials are incorrect",success:false},{status:405})
        }
        
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error})
    }

}