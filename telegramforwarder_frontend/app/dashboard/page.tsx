'use client';

import { useEffect, useState } from 'react';

type Chat = {
  id: number;
  name: string;
  type: string;
};

export default function DashboardPage() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [links, setLinks] = useState<{ source: string; dest: string }[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const phone = localStorage.getItem('telegramPhone');
    if (!phone) {
      setError('No phone found in localStorage');
      return;
    }

    const fetchChats = async () => {
      try {
        const res = await fetch('http://localhost:5001/get-chats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone }),
        });

        const data = await res.json();
        if (res.ok) {
          setChats(data);
        } else {
          setError(data.error || 'Unknown error');
        }
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchChats();
  }, []);

  const addLink = () => {
    if (source && destination && source !== destination) {
      setLinks([...links, { source, dest: destination }]);
      setSource('');
      setDestination('');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🔗 Chat Forwarding Links</h1>

      {error && <p className="text-red-500 mb-4">⚠️ {error}</p>}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Link Chats</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">Select Source</option>
            {chats.map((chat) => (
              <option key={chat.id} value={chat.id}>
                {chat.name} ({chat.type})
              </option>
            ))}
          </select>

          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">Select Destination</option>
            {chats.map((chat) => (
              <option key={chat.id} value={chat.id}>
                {chat.name} ({chat.type})
              </option>
            ))}
          </select>

          <button
            onClick={addLink}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Link
          </button>
        </div>
      </div>

      {links.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Current Links</h2>
          <ul className="list-disc list-inside">
            {links.map((link, index) => (
              <li key={index}>
                {link.source} ➜ {link.dest}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
