"use client";

import React from "react";
// import { Input } from '../ui/input';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const identifier = formData.get("identifier");
    const password = formData.get("password");

    // console.log("identifier", identifier, password);
    if (!identifier || !password) {
      toast({
        title: "Please fill all fields",
        variant: "destructive",
      });
      return;
    } else {
      const response = await signIn("credentials", {
        identifier,
        password,
        redirect: false, 
      callbackUrl: "/", 
      });
      // console.log("this is response", response);

      if (response.error) {
        toast({
          title: "Login failed",
          description: "check credentials!",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged in successfully",
        });
        router.push("/");
      }
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-3 md:space-y-1.5">
            <Input id="email" name="identifier" placeholder="email" />
            <Input id="password" name="password" placeholder="password" />
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
