// src/app/onboarding/page.tsx
'use client';

import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/connect');
  };

  return (
    <main className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <h1 className="text-3xl font-bold mb-4 text-center">🛡️ Why We Need Telegram Access</h1>
        <ul className="list-disc list-inside text-lg space-y-2 mb-6">
          <li>Forwarding from <strong>private chats</strong> requires Telegram login.</li>
          <li>We <strong>never see or store</strong> your Telegram password.</li>
          <li>We <strong>don’t save or read messages</strong> — only chat IDs are used.</li>
          <li>You can revoke access at <strong>any time</strong> in Telegram settings.</li>
        </ul>
        <p className="text-sm text-gray-600 mb-8">
          🔒 This code is only used to authenticate your Telegram session securely. We prioritize your privacy and transparency.
        </p>
        <button
          onClick={handleContinue}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
