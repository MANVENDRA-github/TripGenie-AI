import React from 'react'
import { Globe2, Plane, Landmark, Map } from 'lucide-react'

const suggestions = [
  {
    title: 'Create New Trip',
    icon: <Globe2 className='w-5 h-5' style={{ color: '#3b82f6' }} />,
  },
  {
    title: 'Inspire me with travel ideas',
    icon: <Plane className='w-5 h-5' style={{ color: '#60a5fa' }} />,
  },
  {
    title: 'Discover hidden gems',
    icon: <Landmark className='w-5 h-5' style={{ color: '#f59e0b' }} />,
  },
  {
    title: 'Adventure Destinations',
    icon: <Map className='w-5 h-5' style={{ color: '#10b981' }} />,
  },
]

function EmptyBoxState({ onSelectOption }: any) {
  return (
    <div className='mt-4'>
      <h2 className='font-bold text-xl text-center' style={{ color: 'var(--app-text)' }}>
        Start planning your <strong style={{ color: 'var(--color-blue)' }}>trip</strong> with TripGenie AI!
      </h2>
      <p className='text-center mt-2' style={{ color: 'var(--app-muted)', fontSize: '0.9rem' }}>
        Get personalized itineraries, hotel picks, and day-by-day plans tailored to your preferences.
      </p>

      <div className='flex flex-col gap-3 mt-5'>
        {suggestions.map((item, index) => (
          <div
            key={index}
            onClick={() => onSelectOption(item.title)}
            className='flex items-center gap-2 rounded-xl p-3 cursor-pointer transition-all'
            style={{
              border: '1px solid var(--app-border)',
              color: 'var(--app-text)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-blue)';
              (e.currentTarget as HTMLElement).style.background = 'var(--app-surface)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--app-border)';
              (e.currentTarget as HTMLElement).style.background = 'transparent';
            }}
          >
            {item.icon}
            <span className='text-sm font-medium'>{item.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default EmptyBoxState
