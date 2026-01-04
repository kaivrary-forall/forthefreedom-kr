import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관리자 | 자유와혁신',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
