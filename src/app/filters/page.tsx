// app/filters/page.tsx
'use client';

import { useState } from "react";
import { FunnelIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function FiltersPage() {
  const [rules, setRules] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState("Remove if contains");

  const addRule = () => {
    if (input.trim()) {
      setRules([...rules, `${mode}: ${input}`]);
      setInput("");
    }
  };

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-lg font-semibold flex items-center justify-center gap-2 mb-4">
        <FunnelIcon className="h-5 w-5" />
        Message Filter Rules
      </h1>

      <div className="bg-white shadow-md p-4 rounded-md space-y-4">
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option>Remove if contains</option>
            <option>Highlight if contains</option>
          </select>

          <input
            className="flex-grow border rounded px-2 py-1 text-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Keyword or phrase"
          />

          <button
            onClick={addRule}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <div>
          {rules.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No rules added yet.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {rules.map((rule, i) => (
                <li key={i} className="border-b py-1">{rule}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
