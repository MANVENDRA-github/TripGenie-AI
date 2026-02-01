import React from 'react'
import { Globe2, Plane, Landmark, Map } from 'lucide-react'
import { suggestions } from '@/app/_components/Hero'

function EmptyBoxState({onSelectOption}:any) {
  return (
    <div className='mt-7 '>
        <h2 className='font-bold text-2xl text-center'>
            Start planning your <strong className='text-primary'>trip</strong> using TripGenie-AI!
        </h2>
        <p className='text-center text-gray-500 mt-2'>Get personalized travel itineraries, budget-friendly plans, and destination insights tailored to your preferences. Let TripGenie-AI handle the planning while you focus on enjoying the journey.</p>
    
    <div className='flex flex-col gap-5 mt-7'>
              {suggestions.map((suggestions,index)=>(
                <div key={index} 
                onClick={()=>onSelectOption(suggestions.title)}
                className='flex items-center gap-1 border rounded-xl 
                p-3 cursor-pointer hover:border-primary hover:text-primary'>
                  {suggestions.icon}
                  <h2 className='text-lg'>{suggestions.title}</h2>
                </div>
              ))}
    </div>
    
    
    </div>
  )
}


export default EmptyBoxState