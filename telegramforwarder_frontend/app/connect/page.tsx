'use client';
import { useState } from 'react';

export default function ConnectPage() {
  const [phone, setPhone] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('telegramPhone', phone);
    // Simulate auth trigger
    alert(`📞 Phone saved: ${phone}`);
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4 text-gray-800">📞 Connect Telegram</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter your phone number to authenticate your Telegram account.
        </p>

        <form onSubmit={handleConnect} className="space-y-4">
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="w-full border rounded px-4 py-2 text-lg"
            required
          />
          <button
            type="submit"
            className="bg-[#0088cc] text-white w-full py-2 rounded-full hover:bg-[#0075b4] transition"
          >
            Connect
          </button>
        </form>
      </div>
    </main>
  );
}
