'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type FilterRule = {
  type: string;
  keyword: string;
};

export default function FiltersPage() {
  const [filterType, setFilterType] = useState('remove');
  const [keyword, setKeyword] = useState('');
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('telegramUser') || '{}');
    if (!user?.is_subscribed) {
      router.push('/subscribe');
    }
  }, [router]);

  const handleAddRule = () => {
    if (!keyword.trim()) return;
    setRules([...rules, { type: filterType, keyword: keyword.trim() }]);
    setKeyword('');
  };

  return (
    <main className="p-4 max-w-md mx-auto space-y-6">
      <h1 className="text-xl font-bold text-center">🧹 Message Filter Rules</h1>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div className="bg-white p-4 shadow rounded space-y-4">
        <div className="flex items-center gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border px-2 py-1 rounded text-sm"
          >
            <option value="remove">Remove if contains</option>
            <option value="highlight">Highlight if contains</option>
          </select>

          <input
            type="text"
            placeholder="Keyword or phrase"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="flex-grow border px-3 py-1 rounded text-sm"
          />

          <button
            onClick={handleAddRule}
            className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2 text-sm">
          {rules.length === 0 ? (
            <p className="text-gray-500 text-center">No rules added yet.</p>
          ) : (
            rules.map((rule, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center border-b py-1"
              >
                <span>
                  {rule.type === 'remove' ? '🗑️ Remove' : '✨ Highlight'}{' '}
                  <strong>{rule.keyword}</strong>
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
