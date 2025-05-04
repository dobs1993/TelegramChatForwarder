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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <span role="img" aria-label="lock">🔒</span>
        <span>Enter Login Code</span>
      </h1>

      <input
        type="text"
        placeholder="Phone number"
        className="px-4 py-2 border border-gray-300 rounded-md mb-4 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <input
        type="text"
        placeholder="Verification code"
        className="px-4 py-2 border border-gray-300 rounded-md mb-4 w-72 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <button
        onClick={verifyCode}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition w-72"
      >
        {status === 'Verifying code...' ? 'Verifying...' : 'Verify Code'}
      </button>

      {status && (
        <p className="mt-4 text-sm text-gray-700 text-center w-72">{status}</p>
      )}
    </div>
  );
}

