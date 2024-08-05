"use client";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import axios from "axios";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { SkeletonDemo } from "@/components/Skeleton";

function Page() {
  const [copy, setCopy] = useState("Copy");
  const [messages, setMessages] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [isSwitchLoading, setSwitchLoading] = useState(false);

  const { data: session, status } = useSession();
  const user = session?.user;
  // console.log(user)

  const { toast } = useToast();

  const handleMessageDelete = (messageId) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessage = watch("acceptMessage");

  const fetchAcceptMessage = useCallback(async () => {
    setSwitchLoading(true);
    try {
      let response = await axios.get("/api/accept-message");
      // console.log(response.data)
      if (response.data.isAcceptingMessages === true) {
        setValue("acceptMessage", response.data.isAcceptingMessages);
        toast({
          title: "You are accepting messages",
          description: "Accept message is : ON.",
        });
      } else {
        setValue("acceptMessage", response.data.isAcceptingMessages);
        toast({
          title: "You are not accepting messages",
          description: "Accept message is : OFF.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error fetching message settings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSwitchLoading(false);
    }
  }, [setValue]);

  const getMessage = useCallback(
    async (refresh) => {
      setLoading(true);
      setSwitchLoading(false);
      try {
        let response = await axios.get("/api/get-messages");
        // console.log(response.data.message);
        setMessages(response.data.message || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages.",
          });
        }
      } catch (error) {
        console.log("Error in fetching messages", error);
        toast({
          title: "Fetching of messages failed!",
          description: "Try again in a while.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setSwitchLoading(false);
      }
    },
    [setLoading, setMessages]
  );

  const handleSwitchChange = async () => {
    try {
      let response = await axios.post("/api/accept-message", {
        acceptMessage: !acceptMessage,
      });
      // console.log(response.data.updatedUser.isAcceptingMessages)
      // console.log(response.data);
      setValue("acceptMessage", !acceptMessage);
      if (response.data.updatedUser.isAcceptingMessages == false) {
        toast({
          title: "Accept message is : ON.",
          description: response.data.message,
        });
      } else {
        toast({
          title: "Accept message is : OFF.",
          description: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "error",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    getMessage();
  }, [session, setValue, fetchAcceptMessage, getMessage]);

  const username = session?.user.username;
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Profile URL copied to clipboard",
      description: "You can now share your profile with others.",
    });
    setCopy("Copied!");
    setTimeout(() => {
      setCopy("Copy");
    }, 10000);
  };

  return (
    <div className="min-h-screen mt-52 md:mt-24 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>{copy}</Button>
        </div>
      </div>

      <Separator />

      <div className="m-4 space-x-3 flex ">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessage}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <p> Accepting Messages :{acceptMessage ? "On" : "Off"}</p>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getMessage(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      

        { isLoading ?
          <SkeletonDemo/>
        :
        Array.isArray(messages) && messages.length > 0 
          ?
         (
           <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          {
            messages.map((msg)=>{
              return(
                <MessageCard
                 key={msg._id}
                 message={msg}
                 onMessageDelete={handleMessageDelete}
                 />
              )
            })
          }
          </div>
         )
          :
          <p className="text-center mt-8 text-xl text-neutral-400">No messages to show , kindly share your Profile URL.</p>
        }
      {/* <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
        { isLoading ?
          <h1>Loadiung your messages ...</h1>
        :
          messages.length > 0 
          ?
         (
          messages.map((msg,index)=>{
            return(
              <MessageCard
               key={index}
               message={msg}
               onMessageDelete={handleMessageDelete}
               />
            )
          })
         )
          :
          <p>No messages to show</p>
        }
      </div> */}
    </div>
  );
}

export default Page;
