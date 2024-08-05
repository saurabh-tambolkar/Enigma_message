import User from '@/model/User'
import connectDB from '@/lib/dbConnect'
import { NextResponse } from 'next/server';

export async function POST(req){
    await connectDB();
    let payload = await req.json();
    let {username,content} = payload;
    console.log(payload)

    try {
        const user = await User.findOne({username})
        if(!user){
            return NextResponse.json({message:"User not found.",success:false})
        }
        else{
            if(!user.isAcceptingMessages){
                return NextResponse.json({message:"User is not accepting messages.",success:false})
            }
            else{
                const newMessage = {content,createdAt : new Date()}
                user.messages.push(newMessage)
                await user.save()
                return NextResponse.json({message:"Message sent successfully.",success:true})
            }
        }
    } catch (error) {
        console.log("cant sent message",error)
        return NextResponse.json({message:"cant sent message",success:false})
    }
}