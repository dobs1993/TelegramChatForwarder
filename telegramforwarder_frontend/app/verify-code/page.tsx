// src/app/verify-code/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 TODO: Verify code with Telegram API
    console.log('Verifying code:', code);
    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-xl font-semibold mb-4">🔐 Enter Login Code</h1>
      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="e.g. 12345"
          className="w-full border rounded px-4 py-2 text-lg"
          required
        />
        <button type="submit" className="bg-telegram text-white px-4 py-2 rounded w-full">
          Verify Code
        </button>
      </form>
    </main>
  );
}
