"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z  from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {  Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage, } from "@/components/ui/form";
import { Loader2 } from "lucide-react";

function Page() {
  let {toast} = useToast();
  let router = useRouter();

  const [username, setUsername] = useState("");
  const [usernameMsg, setUsernameMsg] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 600);

  const form = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  useEffect(()=>{
      const checkUsername=async()=>{
          if(username){
              setIsCheckingUsername(true)
              setUsernameMsg('')
              try {
                  let response = await axios.get(`/api/check-unique-username?username=${username}`)
                  console.log("this is response from fe",response)
                  setUsernameMsg(response.data.message)
                } catch (error) {
                  console.log(error)
                  const axiosError = AxiosError;
                  setUsernameMsg(axiosError.response?.data.message ?? "Error checking username.")
              }
              finally {
                  setIsCheckingUsername(false)
              }
          }
      }
      checkUsername();
  },[username])

  const onSubmit = async (data) => {
    // console.log("ckiked")
    setIsSubmitting(true);
    try {
      let response = await axios.post(`/api/sign-up`, data);
      console.log(response);
      toast({
        title: "Signed up successfully.",
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log('thissi errro from page.js',error);
      const axiosError = AxiosError;
      let errMsg = axiosError.response?.data.message;
      toast({
        variant: "destructive",
        title: "Sign up failed !",
        description: errMsg,
      });
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-white">
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-extrabold lg:text-2xl mb-6">
            Join Enigma Message
          </h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter username" {...field} onChange={(e)=>{field.onChange(e); 
                        debounced(e.target.value)}}/>
                        </FormControl>
                        {
                          isCheckingUsername && <Loader2 className="text-xl ml-2 animate-spin"/>    
                        }
                        <p className={`text-xs font-semibold ${usernameMsg === "Username is available." ?"text-green-500" :"text-red-600 "}`}>{usernameMsg}</p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter email" {...field}/>
                  </FormControl>
                  <FormDescription className="text-xs ">
                    You will get an OTP on this email.
              </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter secures password" type="password" {...field}/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> 
             <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div>
            <p className="text-left">Already a member? <Link className="text-sky-600 hover:text-sky-800" href={'/sign-in'}>Sign In</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Page;
