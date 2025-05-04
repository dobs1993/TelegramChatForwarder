import './globals.css'
import BottomNavbar from './components/bottomnavbar'

export const metadata = {
  title: 'Telegram Tools',
  description: 'Telegram Forwarding Mini App',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-full overflow-hidden bg-[#f6f7f8] text-gray-900 font-sans relative">
        
        {/* ✅ Test block for Tailwind */}
        <div className="bg-red-500 text-white p-4 text-center">
          TAILWIND WORKS (layout.tsx)
        </div>

        {/* ✅ Main content wrapper */}
        <main className="flex-grow w-full overflow-y-auto flex justify-center items-center px-4">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </main>

        {/* ✅ Bottom nav should appear here */}
        <BottomNavbar />
      </body>
    </html>
  )
}
