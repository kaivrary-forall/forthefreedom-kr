import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Card News | Freedom & Innovation',
  description: 'Freedom & Innovation card news and visual stories.',
}

export default function CardNewsPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Card News</h1>
          <p className="text-xl text-gray-200 drop-shadow">Visual Stories</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-images text-4xl mb-4"></i>
            <p>No card news available.</p>
          </div>

          <div className="mt-8 text-center">
            <Link href="/en/news" className="text-primary hover:underline">
              <i className="fas fa-arrow-left mr-2"></i>Back to News
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
