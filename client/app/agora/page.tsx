import type { Metadata } from 'next'
import Link from 'next/link'
import AgoraListAPI from '@/components/agora/AgoraListAPI'

export const metadata: Metadata = {
  title: '아고라 | 자유와혁신',
  description: '자유와혁신 자유게시판. 당원과 시민이 자유롭게 의견을 나누는 공간입니다.',
  openGraph: {
    title: '아고라 | 자유와혁신',
    description: '자유와혁신 자유게시판',
    url: 'https://www.forthefreedom.kr/agora',
  },
}

export default function AgoraPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">아고라</h1>
          <p className="text-xl text-gray-200 drop-shadow">자유롭게 의견을 나누는 공간</p>
        </div>
      </section>

      <main className="relative z-10 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 상단 제목 */}
          <h2 className="text-xl font-bold text-gray-900 mb-6">자유게시판</h2>

          {/* 게시글 목록 (글쓰기 버튼 포함) */}
          <AgoraListAPI />
        </div>
      </main>
    </div>
  )
}
