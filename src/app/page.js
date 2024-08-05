'use client'
import Image from "next/image";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import messageData from '@/data/messages.json'
import Autoplay from 'embla-carousel-react'
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";



export default function Home() {



  return (
    <>
    <main className="">
      <Navbar/>
      <div className="min-h-screen flex flex-col flex-grow items-center justify-center px-4 md:px-24 py-12">
      <h1 className="text-3xl md:text-5xl font-bold text-center">Presents you the world of anonymous conversations!</h1>
      <p className="text-xl text-center font-semibold mt-4 text-neutral-600">Enigma Message : Your identity remains a secret.</p>
      </div>
    </main>
    <Separator/>
    <Footer/>
    </>
  );
}
