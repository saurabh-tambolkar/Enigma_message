import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { useToast } from "./ui/use-toast";
import { format } from "date-fns";
import axios from "axios";
  

function MessageCard({message,onMessageDelete}) {

    const {toast} = useToast();

    const handleDeleteConfirm=async()=>{
        const response = await axios.delete(`/api/delete-message/${message._id}`)
        toast({
            title:response.data.message
        })
        onMessageDelete(message._id)
    }

    const date=new Date(message.createdAt);
    const formattedDate = format(date,'PPpp')

  return (
    <Card>
      <CardHeader className="space-y-2">
        <CardTitle>{message.content}</CardTitle>
        <CardDescription>{formattedDate}</CardDescription>
        <AlertDialog>
      <AlertDialogTrigger asChild className="w-3/12">
        <Button variant="destructive" className=" text-sm">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this message and remove from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
      </CardHeader>
      <CardContent>
      </CardContent>
     
    </Card>
  );
}

export default MessageCard;
