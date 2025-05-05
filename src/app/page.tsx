'use client';

import Link from 'next/link';
import OnboardingModal from './components/OnboadingModal';

export default function HomePage() {
  return (
    <>
      <OnboardingModal />
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Welcome to TGramTools</h1>
          <p className="text-sm text-gray-600">What would you like to do today?</p>
          <div className="grid grid-cols-2 gap-3 justify-center">
            <Link
              href="/connect"
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2"
            >
              <span>🔧 Connect Telegram</span>
            </Link>
            <Link
              href="/dashboard-linker"
              className="bg-green-100 text-green-800 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2"
            >
              <span>🖇️ Set Up Chat Links</span>
            </Link>
            <Link
              href="/dashboard-links"
              className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2"
            >
              <span>🔍 View Active Links</span>
            </Link>
            <Link
              href="/filters"
              className="bg-purple-100 text-purple-800 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-2"
            >
              <span>🛠️ Manage Filters</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
