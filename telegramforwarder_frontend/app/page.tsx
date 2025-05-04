'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userRaw = localStorage.getItem('telegramUser')
    const phone = localStorage.getItem('telegramPhone')

    if (!phone) {
      router.replace('/connect')
      return
    }

    if (!userRaw) {
      router.replace('/verify-code')
      return
    }

    const user = JSON.parse(userRaw)
    if (user.is_subscribed) {
      router.replace('/dashboard')
    } else {
      router.replace('/subscribe')
    }
  }, [router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center text-gray-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#0088cc] mx-auto mb-4"></div>
        Redirecting...
      </div>
    </main>
  )
}

