import { auth } from '@/auth';
import connectDB from '@/lib/dbConnect'
import {User} from '@/model/User'
import { NextResponse } from 'next/server';

export async function DELETE(req,{params}){

    const messageID = params.messageID;
    console.log(messageID)

    await connectDB();

    const session = await auth();
    const user = session?.user;

    if(!session || !session.user){
        return NextResponse.json({message:"user not authenticated"})
    }
    else{
        try {
            console.log("this is try part.")
            const response = await User.updateOne({username:user.username},{$pull:{messages:{_id:messageID}}})
            console.log(response)
            if(response.modifiedCount == 0){
                return NextResponse.json({message:"message not found",success:false})
            }else{
                return NextResponse.json({message:"message deleted",success:true})
            }
        } catch (error) {
            console.log("error in deleting message")
            return NextResponse.json({message:"Cant delete message",success:false})     
        }

    }
}