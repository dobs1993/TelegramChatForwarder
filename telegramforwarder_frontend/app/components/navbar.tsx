'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/connect', label: 'Connect Phone' },
  { href: '/dashboard', label: 'Link Chats' },
  { href: '/dashboard/links', label: 'Active Links' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-sm mx-auto flex justify-between items-center px-4 py-2">
        {navItems.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-sm font-medium ${
              pathname === href
                ? 'text-[#229ED9] border-b-2 border-[#229ED9]'
                : 'text-gray-500'
            } px-2 py-1`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
