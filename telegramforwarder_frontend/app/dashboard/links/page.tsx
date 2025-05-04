'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Link = {
  source_id: number;
  destination_id: number;
};

export default function DashboardLinksPage() {
  const [links, setLinks] = useState<Link[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
    if (!user?.is_subscribed) {
      router.push('/subscribe');
      return;
    }

    const phone = localStorage.getItem('telegramPhone');
    if (!phone) {
      setError('No phone number found. Please connect first.');
      return;
    }

    fetch('http://localhost:5001/get-links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setLinks(data);
        } else {
          setError(data.error || 'Unexpected error');
        }
      })
      .catch(() => setError('Failed to load links. Is the backend running?'));
  }, [router]);

  const chatMap = JSON.parse(localStorage.getItem('chatNameMap') || '{}');

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">🔍 Active Chat Links</h1>
      {error && <p className="text-sm text-red-600 mb-2">⚠️ {error}</p>}

      <div className="bg-white p-4 shadow rounded space-y-3">
        {links.length === 0 ? (
          <p className="text-sm text-gray-500 text-center">No links set.</p>
        ) : (
          links.map((link, idx) => (
            <div key={idx} className="text-sm text-gray-800 flex justify-between border-b pb-2 last:border-none">
              <span>
                <strong>{chatMap[link.source_id] || link.source_id}</strong> ➜{' '}
                <strong>{chatMap[link.destination_id] || link.destination_id}</strong>
              </span>
            </div>
          ))
        )}
      </div>
    </main>
  );
}

