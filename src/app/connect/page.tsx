// App --> Connect --> page.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConnectPage() {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5001/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('telegramPhone', phone);
        router.push('/verify-code');
      } else {
        setError(data.error || 'An unexpected error occurred.');
      }
    } catch (err) {
      setError((err as Error).message || 'Network error');
    } finally {
      setLoading(false);
    }
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
            className={`w-full py-2 rounded-full text-white font-semibold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#0088cc] hover:bg-[#0075b4] cursor-pointer'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending Code...' : 'Connect'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
