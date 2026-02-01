"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { SignIn, SignInButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs';

const menuOptions = [
  {
    name: 'Home',
    path: '/'
  },
  {
    name: 'Pricing',
    path: '/pricing'
  },
  {
    name: 'Contact Us',
    path: '/contact-us'
  }
]

function Header() {

  const {user} = useUser();

  return (
    <div className="flex items-center justify-between p-4">
      
      {/* logo */}
      <div className="flex gap-2 items-center">
        <Image src="/logo.svg" alt="logo" width={30} height={30} />
        <h2 className="font-bold text-2xl text-primary">TripGenie AI</h2>
      </div>

      {/* menu options */}
      <div className="flex gap-8 items-center justify-center">
        {menuOptions.map((menu, index) => (
          <Link key={index} href={menu.path}>
            <h2 className="text-lg cursor-pointer hover:text-primary scale-105 transition-transform">
              {menu.name}
            </h2>
          </Link>
        ))}
      </div>

      {/* get started button */}
      {!user? <SignInButton mode="modal">
        <Button className='cursor-pointer'>
          Get Started
        </Button>
      </SignInButton>:
        <Link href={'/create-new-trip'}>  
          <Button className='cursor-pointer'>Create New Trip</Button>
        </Link>}
    </div>
  )
}

export default Header
