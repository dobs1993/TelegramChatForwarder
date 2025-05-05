// app/dashboard-links/page.tsx
"use client";

import { useEffect, useState } from "react";
import { AiOutlineLink } from 'react-icons/ai';


interface LinkItem {
  source_id: string;
  destination_id: string;
  source_name: string;
  destination_name: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const phone = localStorage.getItem("telegramPhone");
        const res = await fetch("http://localhost:5000/get-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setLinks(data);
        } else {
          setError("Failed to load links.");
        }
      } catch (err) {
        setError("Failed to load links.");
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h2 className="text-xl font-bold flex items-center mb-4">
        <AiOutlineLink className="mr-2" /> Active Forwarding Links
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : links.length === 0 ? (
        <p className="text-gray-500">No active links</p>
      ) : (
        <div className="w-full max-w-md">
          {links.map((link) => (
            <div key={link.source_id + link.destination_id} className="bg-white rounded-xl shadow-md p-4 mb-3">
              <p className="text-sm text-gray-600">
                <span className="font-medium">{link.source_name}</span> ➜ <span className="font-medium">{link.destination_name}</span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
