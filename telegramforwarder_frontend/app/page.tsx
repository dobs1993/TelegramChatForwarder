// src/app/page.tsx
'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center text-center min-h-screen px-4 space-y-6">
      <div className="text-2xl font-semibold">🚀 TelegramTools</div>
      <p className="text-sm text-gray-600 max-w-sm">
        This app helps you forward messages from private Telegram chats, filter out unwanted content, and manage your connections — all with no sensitive data stored.
      </p>

      <div className="w-full flex flex-col space-y-3">
        <Link
          href="/onboarding"
          className="bg-telegram text-white py-2 rounded-md text-sm text-center hover:bg-[#0075b4]"
        >
          Start Onboarding
        </Link>
        <Link
          href="/connect"
          className="text-sm text-telegram text-center underline"
        >
          Already have a code?
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 text-center underline"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
