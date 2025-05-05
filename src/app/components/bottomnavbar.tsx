'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Home, Link as LinkIcon, Phone, ShieldCheck, Plug } from 'lucide-react';

export default function BottomNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSubscribed, setIsSubscribed] = useState(true); // Set default to true for now

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
    setIsSubscribed(user?.is_subscribed ?? false);
  }, []);

  const navItems = [
    {
      label: 'Home',
      href: '/',
      icon: <Home size={20} />,
    },
    {
      label: 'Connect',
      href: '/connect',
      icon: <Phone size={20} />,
    },
    {
      label: 'Linker',
      href: '/dashboard-linker',
      icon: <Plug size={20} />,
      requiresSub: true,
    },
    {
      label: 'Links',
      href: '/dashboard-links',
      icon: <LinkIcon size={20} />,
    },
    {
      label: 'Filters',
      href: '/filters',
      icon: <ShieldCheck size={20} />,
      requiresSub: true,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white flex justify-around py-2 border-t border-gray-700 z-50">
      {navItems.map((item) => {
        if (item.requiresSub && !isSubscribed) return null;

        const isActive = pathname === item.href;

        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex flex-col items-center text-sm transition cursor-pointer ${
              isActive ? 'text-blue-400 font-bold' : 'text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
