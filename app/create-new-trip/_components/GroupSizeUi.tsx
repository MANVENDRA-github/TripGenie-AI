import React from 'react'

export const SelectTravelesList = [
  {
    id: 1,
    title: 'Just Me',
    desc: 'A sole traveler in exploration',
    icon: '✈️',
    people: '1',
  },
  {
    id: 2,
    title: 'A Couple',
    desc: 'Two travelers in tandem',
    icon: '🥂',
    people: '2 People',
  },
  {
    id: 3,
    title: 'Family',
    desc: 'A group of adventurers',
    icon: '🏡',
    people: '3 to 5 People',
  },
  {
    id: 4,
    title: 'Friends',
    desc: 'A bunch of thrill-seekers',
    icon: '⛺',
    people: '5 to 10 People',
  },
]


function GroupSizeUi({onSelectedOption}:any) {
  return (
    <div className='grid grid-cols-3 md:grid-cols-4 gap-2 items-center mt-1'>
        {SelectTravelesList.map((item,index)=>(
            <div key={index} className='p-3 border border-border rounded-2xl bg-card text-card-foreground shadow-sm 
            hover:border-blue-500 cursor-pointer flex flex-col items-center text-center transition-colors'
            onClick={() => onSelectedOption(item.title)}
            >
                <div className="text-3xl mb-2">{item.icon}</div>
                <h2 className="font-semibold text-sm">{item.title}</h2>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
        ))}
    </div>
  )
}

export default GroupSizeUi