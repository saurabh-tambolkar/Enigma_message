// export { auth as middleware } from "@/auth"

import { NextResponse } from 'next/server';
import { auth } from '@/auth';

export async function middleware(req) {
  const url = req.nextUrl;
  // console.log('this is url :',url)


  const session = await auth();
  const user = session?.user;
//   console.log('this is user :',user)

  if(user && (
    url.pathname.startsWith('/sign-in') ||
    url.pathname.startsWith('/sign-up') ||
    url.pathname.startsWith('/verify') 
  )){
    return NextResponse.redirect(new URL('/dashboard',req.url))
  }
  else{
    if(!user && 
      (url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/u/'))
    ){
        return NextResponse.redirect(new URL('/sign-in',req.url))
    }
    return NextResponse.next();
  }
}
