"use client"

import React from 'react'
import { Globe2, Loader } from 'lucide-react'

function FinalUi({ generating }: { generating: boolean }) {
  return (
    <div className="flex flex-col items-center justify-center mt-4 p-5 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-xl border border-transparent dark:border-indigo-500/20">
      
      {generating ? (
        <>
          <Loader className="w-8 h-8 text-indigo-500 dark:text-indigo-400 animate-spin" />
          <h2 className="mt-3 text-base font-semibold text-indigo-700 dark:text-indigo-300 text-center">
            ✈️ Planning your dream trip...
          </h2>
          <p className="text-sm text-indigo-500 dark:text-indigo-400/80 text-center mt-1">
            Generating a tailored itinerary with hotels, activities, and day-by-day plans. This may take a moment...
          </p>
        </>
      ) : (
        <>
          <Globe2 className="w-8 h-8 text-green-500" />
          <h2 className="mt-3 text-base font-semibold text-green-700 dark:text-green-400 text-center">
            ✅ Trip ready! Redirecting...
          </h2>
        </>
      )}
    </div>
  )
}

export default FinalUi
