'use client';
import { useEffect, useState } from 'react';
import Select from 'react-select';

type Chat = {
  id: number;
  name: string;
  type: string;
};

type Option = {
  value: string;
  label: string;
};

export default function DashboardPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [source, setSource] = useState<Option | null>(null);
  const [dest, setDest] = useState<Option | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
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
        } else {
          setError(data.error || 'Unexpected error');
        }
      } catch (e) {
        setError('Failed to load chats. Is the backend running?');
      }
    };

    fetchChats();
  }, []);

  const chatOptions: Option[] = chats.map((chat) => ({
    value: chat.id.toString(),
    label: chat.name,
  }));

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Chat Forwarding Links</h1>

      {error && <p className="text-sm text-red-600 mb-2">⚠️ {error}</p>}

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
          className="w-full bg-blue-500 text-white py-2 rounded"
          onClick={() => {
            if (source && dest && source.value !== dest.value) {
              alert(`Linking ${source.label} ➜ ${dest.label}`);
              // Add your link logic here
            }
          }}
        >
          + Link
        </button>
      </div>
    </main>
  );
}
