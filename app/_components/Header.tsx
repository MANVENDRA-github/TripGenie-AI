"use client"

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { SignInButton, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

const menuOptions = [
  { name: 'Home', path: '/' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Contact Us', path: '/contact-us' },
]

function Header() {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const isPlanner = pathname === '/create-new-trip';

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`header-bar ${isLanding ? 'header-landing' : 'header-app'} ${scrolled ? 'header-scrolled' : ''}`}
    >
      <div className="header-inner">
        <div className="flex items-center gap-4 shrink-0">
          {user && <UserButton afterSignOutUrl="/" />}
          <Link href="/" className="header-logo">
            <Image src="/logo.svg" alt="TripGenie AI" width={28} height={28} />
            <span className="header-logo-text hidden sm:inline-block">TripGenie AI</span>
          </Link>
        </div>

        <nav className="header-nav hidden md:flex flex-1 items-center justify-center gap-8">
          {menuOptions.map((menu, index) => (
            <Link key={index} href={menu.path} className="header-nav-link whitespace-nowrap">
              {menu.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {user ? (
            <>
              <Link href="/my-trips" className="header-btn-ghost hidden lg:block">
                My Trips
              </Link>
              <Link href="/create-new-trip" className="header-btn-primary whitespace-nowrap">
                Create New Trip
              </Link>
            </>
          ) : (
            <SignInButton mode="modal">
              <button className="header-btn-primary whitespace-nowrap">Get Started</button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header
