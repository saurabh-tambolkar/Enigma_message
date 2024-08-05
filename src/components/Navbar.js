'use client'
import React from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { useToast } from './ui/use-toast';
import { Badge } from "@/components/ui/badge"


function Navbar() {

  const {data:session,status} = useSession();
  // console.log(status)

  // console.log('this is user',session)

  const user = session?.user
  // console.log(user)

  const {toast} = useToast();

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed out',
      description:"Go to sign-in page to Sign In."
    })
  };

  return (
    <nav className='fixed top-0 p-4 md:p-6 shadow-md w-full bg-slate-900 text-white'>
      <div className='flex mx-auto flex-col space-y-4 md:space-y-0 md:flex-row justify-between items-center '>
        <Link href="/" className='text-lg font-bold'>Enigma_Message</Link>
        {
          session ?
          (
            <>
            <span className='text-lg text-center font-semibold'>Welcome , <Badge className="px-2 text-md bg-white text-black"> {user.username || user.email}</Badge></span>
            {/* <signOutButton/> */}
            <div className='space-y-2 space-x-2 flex flex-row justify-center items-baseline  md:space-x-4'>
            <Button className="w-full md:w-auto bg-white text-slate-900 font-semibold hover:bg-white hover:text-slate-900 hover:font-extrabold transition-all ease-in-out">
              <Link href={"/dashboard"}>Dashboard</Link></Button>
            <Button className="w-full md:w-auto bg-white text-slate-900 font-semibold hover:bg-white hover:text-slate-900 hover:font-extrabold transition-all ease-in-out">
              <Link href={"/u"}>Send message</Link></Button>
            <Button onClick={handleSignOut} className="w-full md:w-auto bg-white text-slate-900 font-semibold hover:bg-white hover:text-slate-900 hover:font-extrabold transition-all ease-in-out">Sign Out</Button>
            </div>
            </>
          )
          :
          (
            <>
            <Button className="w-full md:w-auto bg-white text-slate-900 font-semibold hover:bg-white hover:text-slate-900 hover:font-extrabold transition-all ease-in-out">
              <Link href={'/sign-in'}>Sign In</Link>
            </Button>
            </>
          )
        }
      </div>
    </nav>
  )
}

export default Navbar
