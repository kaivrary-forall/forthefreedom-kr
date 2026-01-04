import type { Metadata } from 'next'
import AgoraDetailAPI from '@/components/agora/AgoraDetailAPI'

export const metadata: Metadata = {
  title: '아고라 | 자유와혁신',
  description: '자유와혁신 자유게시판',
}

export default function AgoraDetailPage() {
  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative h-[30vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg">아고라</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <AgoraDetailAPI />
        </div>
      </main>
    </div>
  )
}
