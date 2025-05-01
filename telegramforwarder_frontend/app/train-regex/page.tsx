'use client';

import { useState } from 'react';

export default function TrainRegexPage() {
  const [sample, setSample] = useState('');
  const [target, setTarget] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrain = async () => {
    setLoading(true);
    setResult('');

    try {
      const res = await fetch('http://localhost:5001/train-regex', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sample, target }),
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.regex);
      } else {
        setResult(`❌ Error: ${data.error || 'Something went wrong'}`);
      }
    } catch (err: any) {
      setResult(`❌ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">🤖 Train Regex Extractor</h1>

      <div className="bg-white p-4 rounded shadow mb-6 space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Message</label>
          <textarea
            value={sample}
            onChange={(e) => setSample(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
            placeholder={`e.g.\nWWWGD STRAIGHT BET\n[Apr-26-2025 01:06 PM] [NBA] - [562] MIA HEAT +6-110 (Score: 0-0)`}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Text to Extract</label>
          <input
            type="text"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="e.g. MIA HEAT +6-110"
          />
        </div>

        <button
          onClick={handleTrain}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Training...' : '🔍 Generate Regex'}
        </button>
      </div>

      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">🔧 Generated Regex</h2>
          <code className="block p-2 bg-gray-100 rounded text-sm whitespace-pre-wrap">
            {result}
          </code>
        </div>
      )}
    </main>
  );
}
