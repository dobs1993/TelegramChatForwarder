// src/app/verify-code/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    // Simulate Telegram auth + subscription check
    const fakeUser = {
      telegram_id: '12345678',
      is_subscribed: false, // ❗ change to true to simulate paid user
    };

    // Simulate login success
    localStorage.setItem('telegramUser', JSON.stringify(fakeUser));

    if (fakeUser.is_subscribed) {
      router.push('/dashboard');
    } else {
      router.push('/subscribe');
    }
  };

  return (
    <main className="min-h-screen p-6 max-w-md mx-auto flex flex-col justify-center">
      <h1 className="text-xl font-semibold mb-4 text-center">🔐 Enter Login Code</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 12345"
          className="w-full border rounded px-4 py-2 text-lg"
          required
        />
        <button type="submit" className="bg-[#0088cc] text-white px-4 py-2 rounded w-full hover:bg-[#0075b4] transition">
          Verify Code
        </button>
      </form>
    </main>
  );
}
