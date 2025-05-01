// src/app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'TelegramTools',
  description: 'Telegram message tools for linking, filtering, and redirecting',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F2F2F7] text-[#000] font-sans antialiased max-w-md mx-auto border border-gray-300 min-h-screen">
        {/* Telegram-style header */}
        <header className="bg-[#0088cc] text-white px-4 py-3 font-medium text-center shadow">
          TelegramTools Mini App
        </header>

        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
