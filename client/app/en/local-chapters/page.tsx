import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Local Chapters | Freedom & Innovation',
  description: 'Freedom & Innovation regional chapters across Korea.',
}

export default function LocalChaptersPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Local Chapters</h1>
          <p className="text-xl text-gray-200 drop-shadow">Regional Organizations</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Us</h3>
            <p className="text-gray-600 mb-6">
              For information about local chapters, please contact the Organization Department.
            </p>
            <a 
              href="tel:02-2634-2023"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold"
            >
              <i className="fas fa-phone"></i>
              02-2634-2023
            </a>
          </div>

          <div className="mt-8 text-center">
            <Link href="/en/about/organization" className="text-primary hover:underline">
              <i className="fas fa-arrow-left mr-2"></i>Back to Organization
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
