// app/subscribe/page.tsx

'use client';
import Link from 'next/link';

export default function Subscribe() {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 text-center w-full">
      <h1 className="text-xl font-semibold mb-3 text-gray-800">🔒 Access Locked</h1>
      <p className="text-sm text-gray-600 mb-6">
        This feature is only available to TelegramTools Pro users.
      </p>

      <Link
        href="https://telegramtools.com/pricing"
        target="_blank"
        className="bg-[#0088cc] text-white py-2 px-4 rounded-full text-sm font-semibold hover:bg-[#0075b4] transition"
      >
        View Plans & Upgrade
      </Link>
    </div>
  );
}
