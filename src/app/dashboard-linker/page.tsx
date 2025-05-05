'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Select from 'react-select';

// Define types
type Chat = {
  id: number;
  name: string;
  type: string;
};

type Option = {
  value: string;
  label: string;
};

export default function DashboardLinkerPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [source, setSource] = useState<Option | null>(null);
  const [dest, setDest] = useState<Option | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
    if (!user?.is_subscribed) {
      router.push('/subscribe');
      return;
    }

    const fetchChats = async () => {
      const phone = localStorage.getItem('telegramPhone');
      if (!phone) {
        setError('No phone number found. Please connect first.');
        return;
      }

      try {
        const res = await fetch('http://localhost:5001/get-chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();

        if (Array.isArray(data)) {
          const cleaned = data
            .filter((chat) => chat.name && chat.name.trim() !== '')
            .sort((a, b) => a.name.localeCompare(b.name));

          setChats(cleaned);
          setError('');

          const chatMap = Object.fromEntries(
            cleaned.map((chat) => [chat.id, chat.name])
          );
          localStorage.setItem('chatNameMap', JSON.stringify(chatMap));
        } else {
          setError(data.error || 'Unexpected error');
        }
      } catch (e) {
        setError('Failed to load chats. Is the backend running?');
      }
    };

    fetchChats();
  }, [router]);

  const chatOptions: Option[] = chats.map((chat) => ({
    value: chat.id.toString(),
    label: chat.name,
  }));

  const handleLink = async () => {
    if (source && dest && source.value !== dest.value) {
      const phone = localStorage.getItem('telegramPhone');
      const res = await fetch('http://localhost:5001/set-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          source_id: source.value,
          destination_id: dest.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus(`✅ Linked ${source.label} ➔ ${dest.label}`);
        setTimeout(() => setStatus(''), 5000);
      } else {
        setError(`❌ ${data.error}`);
      }
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat Forwarding Links</h1>

      {error && <p className="text-sm text-red-600 mb-2">⚠️ {error}</p>}
      {status && <p className="text-green-600 text-sm mb-2">{status}</p>}

      <div className="bg-white p-4 shadow rounded space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Select Source</label>
          <Select
            options={chatOptions}
            value={source}
            onChange={(selected) => setSource(selected)}
            placeholder="Select source chat..."
            isSearchable
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Select Destination</label>
          <Select
            options={chatOptions}
            value={dest}
            onChange={(selected) => setDest(selected)}
            placeholder="Select destination chat..."
            isSearchable
          />
        </div>

        <button
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          onClick={handleLink}
        >
          + Link
        </button>
      </div>
    </main>
  );
}
