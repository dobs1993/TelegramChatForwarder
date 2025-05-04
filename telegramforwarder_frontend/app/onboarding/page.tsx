'use client';
import Link from 'next/link';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4 text-gray-800">👋 Welcome to TelegramTools</h1>
        <p className="text-sm text-gray-600 mb-4">
          We need permission to access your Telegram account to forward messages.
        </p>
        <ul className="text-sm text-left text-gray-500 list-disc list-inside mb-6 space-y-1">
          <li>We do NOT store your messages.</li>
          <li>We do NOT save private data.</li>
          <li>You remain in full control.</li>
        </ul>
        <Link
          href="/connect"
          className="inline-block bg-[#0088cc] text-white px-4 py-2 rounded-full hover:bg-[#0075b4] transition"
        >
          Continue
        </Link>
      </div>
    </main>
  );
}
