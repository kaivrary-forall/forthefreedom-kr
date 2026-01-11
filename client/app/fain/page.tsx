import type { Metadata } from 'next'
import FainFeed from '@/components/fain/FainFeed'

export const metadata: Metadata = {
  title: 'FAIN | 자유와혁신',
  description: '자유와혁신 FAIN - 당원들의 소통 공간',
}

export default function FainPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <FainFeed />
    </div>
  )
}
