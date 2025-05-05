// App --> verify-code --> page.tsx

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyCodePage() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedPhone = localStorage.getItem('telegramPhone');
    if (!storedPhone) {
      router.push('/connect');
    } else {
      setPhone(storedPhone);
    }
  }, [router]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5001/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ Set cookie instead of localStorage so middleware can access it
        document.cookie = "telegramVerified=true; path=/";
        router.push('/dashboard-links');
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
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-100">
      <div className="bg-white rounded-2xl shadow p-6 w-full max-w-md text-center">
        <h1 className="text-xl font-bold mb-4 text-gray-800">🔐 Enter Login Code</h1>
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            value={phone}
            disabled
            className="w-full border rounded px-4 py-2 text-lg bg-gray-100 text-gray-500"
          />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Verification code"
            className="w-full border rounded px-4 py-2 text-lg"
            required
          />
          <button
            type="submit"
            className={`w-full py-2 rounded-full text-white font-semibold transition ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
            }`}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Code'}
          </button>
        </form>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </div>
    </main>
  );
}
