"use client"

import { Button } from '@/components/ui/button'
import { Globe2 } from 'lucide-react'
import React from 'react'

function FinalUi({ viewTrip }: any) {
  return (
    <div className="flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-lg">
      
      <Globe2 className="text-primary text-4xl animate-bounce" />

      <h2 className="mt-3 text-lg font-semibold text-primary text-center">
        ✈️ Planning your dream trip...
      </h2>

      <p className="text-primary text-sm text-center mt-1">
        Thank you for the information! I'm now generating a tailored itinerary
        for your trip. This might take a moment. Please wait...
      </p>

      <Button
        disabled
        onClick={viewTrip}
        className="mt-2 w-full bg-primary text-white cursor-not-allowed"
      >
        View Trip
      </Button>

    </div>
  )
}

export default FinalUi
