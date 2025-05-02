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
      } catch {
        setError('Failed to load chats. Is the backend running?');
      }
    };

    fetchChats();
  }, []);

  const chatOptions: Option[] = chats.map((chat) => ({
    value: chat.id.toString(),
    label: chat.name,
  }));

  const handleLink = async () => {
    if (source && dest && source.value !== dest.value) {
      const phone = localStorage.getItem("telegramPhone");

      const res = await fetch("http://localhost:5001/set-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          source_id: source.value,
          destination_id: dest.value,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`✅ Linked ${source.label} ➜ ${dest.label}`);
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold text-center">🔗 Link Telegram Chats</h1>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Source Chat</label>
        <Select
          options={chatOptions}
          value={source}
          onChange={setSource}
          placeholder="Choose source"
          isSearchable
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Select Destination Chat</label>
        <Select
          options={chatOptions}
          value={dest}
          onChange={setDest}
          placeholder="Choose destination"
          isSearchable
        />
      </div>

      <button
        onClick={handleLink}
        className="w-full bg-telegram hover:bg-[#0075b4] text-white py-2 rounded-md text-sm"
      >
        ➕ Link Chats
      </button>
    </div>
  );
}

