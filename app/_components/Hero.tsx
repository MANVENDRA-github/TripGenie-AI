"use client"
import React, { use } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Button } from '@/components/ui/button'
import { ArrowDown, Compass, Globe2, Landmark, Map, Plane, Send } from 'lucide-react'
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export const suggestions=[
  {
    title:'Create New Trip',
    icon:<Globe2 className='text-green-400 h-5 w-5'/>,

  },
  {
    title:'Inspire me with travel ideas',
    icon:<Plane className='text-blue-500 h-5 w-5'/>,

  },
  {
    title:'Discover hidden gems',
    icon:<Landmark className='text-orange-600 h-5 w-5'/>,

  },
  {
    title:'Adventure Destinations',
    icon:<Map className='text-yellow-400 h-5 w-5'/>,

  }
]

function Hero() {

  const {user} = useUser();

  const router = useRouter();

  const onSend=()=>{
    if(!user){
      //trigger sign in
      router.push('/sign-in');
      return;
    }
    router.push('/create-new-trip');
  } 
  return (
    <div className='mt-24 w-full flex justify-center'>
        {/*Content*/}
        <div className='max-w-3xl w-full text-center space-y-5'>
            <h1 className='text-xl md:text-4xl font-bold'>Hey ! I am your <span className="text-primary">Personal AI Travel Assistant</span></h1>
            <p className='mt-4 text-lg'>Plan your perfect trip with AI-powered recommendations and personalized travel itineraries.</p>
        

        {/*Input box*/}
        <div>
            <div className='border rounded-2xl p-4 relative'>
                <Textarea placeholder="Create a trip from Paris to New York" 
                className='w-full h-28 bg-transparent border-none focus-visible:ring-0 shadow-none resize-none'
                 />
                <Button size={'icon'} className='absolute bottom-6 right-6 cursor-pointer' onClick={()=>onSend()}>
                  <Send className='w-4 h-4' />
                </Button>
            </div>
        </div>

        {/*Suggestion list*/}
        <div className='flex gap-5'>
          {suggestions.map((suggestion,index)=>(
            <div key={index} className='flex items-center gap-1 border rounded-full 
            p-2 cursor-pointer hover:bg-primary hover:text-white'>
              {suggestion.icon}
              <h2 className='text-sm'>{suggestion.title}</h2>
            </div>
          ))}
        </div>
        
        <h2 className='my-7 mt-14 flex gap-2 text-center'>Not sure where to start? <strong>See how it works</strong> <ArrowDown /></h2>

        {/*Video Section*/}
        <HeroVideoDialog
          className="block dark:hidden"
          animationStyle="from-center"
          videoSrc="https://www.example.com/dummy-video"
          thumbnailSrc="/thumbnail.png"
          thumbnailAlt="Dummy Video Thumbnail"
        />

        </div>
    </div>
  )
}

export default Hero