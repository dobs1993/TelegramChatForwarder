'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomeRedirect() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/dashboard-linker')
  }, [router])

  return <div className="text-center p-10 text-gray-500">Redirecting...</div>
}

