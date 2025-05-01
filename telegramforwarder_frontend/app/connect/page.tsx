'use client';

import { useState } from 'react';

export default function ConnectPage() {
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('');

  const sendCode = async () => {
    setStatus('Sending code...');
    try {
      const res = await fetch('http://localhost:5001/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
  
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('telegramPhone', phone); // ✅ Save it here
        setStatus('✅ Code sent! Check your Telegram app.');
      } else {
        setStatus(`❌ Error: ${data.error || 'Unknown issue'}`);
      }
    } catch (err) {
      setStatus(`❌ Network error: ${(err as Error).message}`);
    }
  };
  

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">📱 Enter Your Phone Number</h1>

      <input
        className="border px-3 py-2 rounded w-full"
        placeholder="+1234567890"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button
        onClick={sendCode}
        className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
      >
        Send Code
      </button>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </main>
  );
}
