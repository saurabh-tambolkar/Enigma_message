"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messageSchema } from "@/schemas/messageSchema";
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
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function Page({ params }) {
  const username = params.username;

  const [isSending,setIsSending] = useState(false)

  const {toast} = useToast()
  const router = useRouter()

  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues:{
        username:username,
        content:""
    }
  });

  const { register,handleSubmit } = form;

  const onSubmit = async(data) => {
    console.log(data)
    setIsSending(true)
    try {
        const response  = await axios.post('/api/send-message',data)
        if(response.data.success){
            toast({
                title: "Message sent successfully",
            })
            router.push('/')
        }
        else{
            toast({
                title: "Failed to send message",
                description: response.data.message,
                variant:"destructive"
            })
        }
    } catch (error) {
        console.log("Cant send msg")
    }
    finally{
        setIsSending(false)
    }
  };

  return (
    <div className="h-[45rem] md:h-[35rem] mt-52 md:mt-28 mx-4 md:mx-8 lg:mx-auto p-6 rounded max-w-4xl w-full bg-white space-y-4">
      <div>
        <h1 className="font-semibold text-3xl">
          Sending message to : {username}
        </h1>
      </div>
      <div className="p-8 rounded bg-slate-100">
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your message to send." {...field} />
                </FormControl>
                <FormDescription>
                  {username} will not see your username.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">
            {
                !isSending ? "Send" :(
                    <>
                    <p>Sending</p>
                    <Loader2 className="h-4 animate-spin"/>
                    </>
                )
            }
          </Button>
        </form>
      </Form>
      </div>
    </div>
  );
}

export default Page;
