'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingModal() {
  const [show, setShow] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const hideModal = localStorage.getItem('hideOnboardingModal');
    if (!hideModal) setShow(true);
  }, []);

  const handleContinue = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideOnboardingModal', 'true');
    }
    setShow(false);
    router.push('/connect');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-md text-center">
        <h2 className="text-lg font-bold mb-2">👋 Welcome to TelegramTools</h2>
        <p className="text-sm text-gray-600 mb-4">
          We need permission to access your Telegram account to forward messages.
        </p>
        <ul className="text-sm text-left text-gray-500 list-disc list-inside mb-4 space-y-1">
          <li>We do NOT store your messages.</li>
          <li>We do NOT save private data.</li>
          <li>You remain in full control.</li>
        </ul>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="dontShowAgain"
            checked={dontShowAgain}
            onChange={() => setDontShowAgain(!dontShowAgain)}
            className="mr-2"
          />
          <label htmlFor="dontShowAgain" className="text-sm text-gray-600">
            Don't show again
          </label>
        </div>
        <button
          onClick={handleContinue}
          className="bg-[#0088cc] hover:bg-[#0075b4] text-white px-4 py-2 rounded-full transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
