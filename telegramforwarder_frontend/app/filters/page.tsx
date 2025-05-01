'use client';

import { useState } from 'react';

type FilterRule = {
  type: 'include' | 'exclude' | 'startsWith' | 'endsWith';
  keyword: string;
};

export default function FilterPage() {
  const [filters, setFilters] = useState<FilterRule[]>([]);
  const [type, setType] = useState<FilterRule['type']>('exclude');
  const [keyword, setKeyword] = useState('');

  const addFilter = () => {
    if (!keyword.trim()) return;
    setFilters([...filters, { type, keyword }]);
    setKeyword('');
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">🧹 Message Filter Rules</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-2">Create New Rule</h2>
        <div className="flex gap-2 mb-2">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as FilterRule['type'])}
            className="border p-2 rounded"
          >
            <option value="exclude">❌ Remove if contains</option>
            <option value="include">✅ Keep only if contains</option>
            <option value="startsWith">❌ Remove if starts with</option>
            <option value="endsWith">❌ Remove if ends with</option>
          </select>
          <input
            type="text"
            placeholder="Keyword or phrase"
            className="border p-2 flex-1 rounded"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <button
            onClick={addFilter}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ➕ Add
          </button>
        </div>
      </div>

      {filters.length > 0 && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">🧾 Active Rules</h2>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {filters.map((rule, idx) => (
              <li key={idx}>
                {rule.type} <code>{rule.keyword}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
