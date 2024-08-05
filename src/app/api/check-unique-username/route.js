import User from '@/model/User'
import mongoose from 'mongoose'
import { z } from 'zod'
import connectDB from '@/lib/dbConnect'
import { usernameValidation } from '@/schemas/signUpSchema'
import { NextResponse } from 'next/server'

const usernameQuerySchema = z.object({
    username:usernameValidation
})

export async function GET(req){
    await connectDB();
    try {
        const url = new URL(req.url)
        // console.log("this is url",req)

        const queryParam = {
            username:url.searchParams.get('username')
        }
        const result = usernameQuerySchema.safeParse(queryParam)
        // console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json(
              {
                success: false,
                message:
                  usernameErrors?.length > 0
                    ? usernameErrors.join(', ')
                    : 'Invalid query parameters',
              },
              { status: 400 }
            );
          }
        console.log("this is result",result)
        const username = result.data.username;
        console.log("this is username from result",username)

        const existUser = await User.findOne({username,isVerified:true})
        if(existUser){
            return NextResponse.json({success:false,message:"Username is already taken."})
        }
        else{
            return NextResponse.json({success:true,message:"Username is available."})
        }

    } catch (error) {
        console.log("error checking username",error)
        return NextResponse.json({message:"error checking username",success:false})
    }
}


