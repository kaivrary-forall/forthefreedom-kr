import type { Metadata } from 'next'
import { Suspense } from 'react'
import AgoraWriteForm from '@/components/agora/AgoraWriteForm'

export const metadata: Metadata = {
  title: '글쓰기 | 아고라 | 자유와혁신',
  description: '자유와혁신 아고라 게시판 글쓰기',
  robots: { index: false, follow: false },
}

export default function AgoraWritePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Suspense fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        }>
          <AgoraWriteForm />
        </Suspense>
      </div>
    </div>
  )
}
