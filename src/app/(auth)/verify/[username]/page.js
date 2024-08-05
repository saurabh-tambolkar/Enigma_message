"use client";
import { useToast } from "@/components/ui/use-toast";
import { verifySchema } from "@/schemas/verfiySchema";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import axios,{axiosError} from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";

function Page() {

  let params = useParams();
  let router = useRouter();
  let { toast } = useToast();

  const [isVerifying,setIsVerifying] = useState(false);

  const form = useForm({
    resolver: zodResolver(verifySchema),
  });

  let onSubmit = async (data) => {
      setIsVerifying(true);
    try {
      let response = await axios.post("/api/verify-code", {
        username: params.username,
        code: data.code,
      });
      console.log(response)
      toast({
        title: "Account is verified successfully.",
        // description: response.data.message,
      });
      router.replace("/sign-in");
      setIsVerifying(false)
    } catch (error) {
      console.log(error);
      const axiosError = AxiosError;
      let errMsg = axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Account cant be verified !",
        description: errMsg,
      });
      setIsVerifying(false)
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-200">
      <div className="w-full max-w-md p-8 rounded-lg space-y-8 bg-white flex flex-col justify-center items-center text-center">
      <h1 className="text-4xl font-bold">Verify your account !</h1>
      <p className="text-sm font-semibold">
        {" "}
        An OTP is sent to your registered email.
      </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-2/3 space-y-6"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>One-Time Password</FormLabel> */}
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">
            {
              isVerifying ? (
                <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
              verifying
                </>
              )
              : "Verify"
            }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
