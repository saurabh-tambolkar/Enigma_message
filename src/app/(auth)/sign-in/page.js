"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "@/auth";
import LoginForm from "@/components/LoginForm";

function Page() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-200">
      <div className="w-full max-w-md p-8 mx-4 rounded-lg space-y-8 bg-white">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold lg:text-2xl mb-6">Sign In</h1>
        </div>
        
        <LoginForm/>
        <div>
          <p className="text-left">
            New to Enigma_Msg? <Link className="text-sky-600 hover:text-sky-800" href="/sign-up">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
