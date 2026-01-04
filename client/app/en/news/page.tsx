import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News | Freedom & Innovation',
  description: 'Check out the latest news from Freedom & Innovation.',
}

export default function NewsPageEn() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News</h1>
          <p className="text-xl text-gray-200">Latest news from Freedom & Innovation</p>
        </div>
      </section>

      {/* News List */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-newspaper text-3xl text-gray-400"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-600">News will be available soon.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
