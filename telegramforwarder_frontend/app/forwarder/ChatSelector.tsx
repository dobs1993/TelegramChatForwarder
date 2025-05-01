// src/app/forwarder/ChatSelector.tsx
'use client';

type Props = {
  source: string;
  destination: string;
  setSource: (value: string) => void;
  setDestination: (value: string) => void;
};

export default function ChatSelector({ source, destination, setSource, setDestination }: Props) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Source Chat</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          placeholder="Enter Source Chat ID"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Destination Chat</label>
        <input
          type="text"
          className="w-full border rounded px-2 py-1"
          placeholder="Enter Destination Chat ID"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
    </div>
  );
}

