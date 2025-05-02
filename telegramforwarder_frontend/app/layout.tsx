import './globals.css';
import Navbar from './components/navbar';

export const metadata = {
  title: 'Telegram Tools',
  description: 'Telegram Forwarding Mini App',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#F5F5F5] text-black">
        <Navbar />
        <main className="max-w-sm mx-auto px-4 py-4">{children}</main>
      </body>
    </html>
  );
}

