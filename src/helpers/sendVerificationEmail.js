import { resend } from "@/lib/resend";
import EmailTemplate from "../../emails/EmailTemplate";
import { NextResponse } from "next/server";

export async function sendVerificationEmail({email,username,verifyCode}){
    try {
        console.log(`Sending verification email to: ${email}`);
        const response = await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: ['delivered@resend.dev'],
            // to: email,
            subject: 'Enigma_Msg | Verifcation code',
            react:EmailTemplate({username:username,otp:verifyCode}),
          });
          console.log(response,verifyCode)
        return NextResponse.json({message:"verification email sent successfully",success:true})
    } catch (error) {
        console.error("Error sending verification email",error)
        return NextResponse.json({success:false,message:"Failed to send verification email"})
    }
}
