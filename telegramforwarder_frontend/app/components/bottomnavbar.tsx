'use client'

import Link from 'next/link'
import { Phone, Link2, Home } from 'lucide-react'

export default function BottomNavbar() {
  return (
    <nav className="w-full fixed bottom-0 left-0 z-50 bg-black text-white py-3">
      <div className="max-w-[400px] mx-auto flex justify-around items-center text-xs">
        <Link href="/connect" className="flex flex-col items-center hover:text-cyan-400">
          <Phone size={20} />
          <span>Connect</span>
        </Link>
        <Link href="/dashboard/links" className="flex flex-col items-center hover:text-cyan-400">
          <Link2 size={20} />
          <span>Links</span>
        </Link>
        <Link href="/" className="flex flex-col items-center hover:text-cyan-400">
          <Home size={20} />
          <span>Home</span>
        </Link>
      </div>
    </nav>
  )
}
