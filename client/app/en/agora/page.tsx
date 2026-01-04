import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Agora | Freedom & Innovation',
  robots: { index: false, follow: false },
}

export default function AgoraPage() {
  return (
    <div>
      <section className="relative h-[40vh] flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/night-pic.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl font-bold mb-4">Agora</h1>
          <p className="text-xl text-gray-200">Discussion Forum</p>
        </div>
      </section>
      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-12 border">
            <i className="fas fa-comments text-primary text-4xl mb-6"></i>
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-gray-600 mb-8">The discussion forum is under development.</p>
            <Link href="/en" className="text-primary hover:underline">← Back to Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
