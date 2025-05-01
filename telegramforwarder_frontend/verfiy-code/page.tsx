'use client';

import { useState } from 'react';

export default function VerifyCodePage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('');

  const verifyCode = async () => {
    setStatus('Verifying code...');
    try {
      const res = await fetch('http://localhost:5001/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(data.status);
      } else {
        setStatus(`❌ Error: ${data.error || 'Unknown issue'}`);
      }
    } catch (err) {
      setStatus(`❌ Network error: ${(err as Error).message}`);
    }
  };

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">🔐 Enter Verification Code</h1>

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="Code from Telegram"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={verifyCode}
        className="bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700"
      >
        Verify Code
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </main>
  );
}
