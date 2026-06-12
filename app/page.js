'use client'
import Landing from '@/components/Landing'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return <Landing onStart={() => router.push('/login')} />
}