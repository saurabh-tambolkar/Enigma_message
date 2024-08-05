'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

function Page() {

    const [checkUsername,setCheckUsername] = useState('')

    const {toast} = useToast()
    const router = useRouter()

    const checkUser=(e)=>{
        e.preventDefault()
        const formData = new FormData(e.target);
        const checkUsername = formData.get('checkUsername')

        if(!checkUsername){
            console.log("fill all field")
            toast({
                title:"fill all the fields.",
                variant:"destructive"
            })
        }
        else{
            router.push(`/u/${checkUsername}`)
        }
    }

  return (
    <div className='mt-24 mx-4 h-[45rem] md:h-[35rem] flex justify-center items-center flex-col space-y-4'>
      <h1 className='text-xl md:text-2xl font-bold'>Enter Username to send message</h1>
      <form onSubmit={checkUser}>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
          <Input name="checkUsername" placeholder="Check Username here" />
            <Button type="submit" className="w-full">
              Check Username
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Page
