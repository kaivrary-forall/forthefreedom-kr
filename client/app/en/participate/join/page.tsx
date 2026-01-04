import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Join Us | Freedom & Innovation',
  description: 'Join Freedom & Innovation party. Become a member today.',
}

export default function JoinPage() {
  return (
    <div>
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Join Us</h1>
          <p className="text-xl text-gray-200 drop-shadow">Become a Member</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Requirements */}
          <div className="bg-gray-50 rounded-xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Membership Requirements</h2>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <span>Korean citizen aged 18 or above</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <span>Not a member of any other political party</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fas fa-check-circle text-green-500 mt-1"></i>
                <span>Agreement with party principles and values</span>
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-user-plus"></i>
              Join Online
            </a>
          </div>

          {/* Contact */}
          <div className="mt-12 bg-gray-50 rounded-xl p-8 text-center">
            <h3 className="font-bold text-gray-900 mb-4">Questions?</h3>
            <p className="text-gray-600 mb-4">Contact the Organization Department</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:02-2634-2023" className="text-primary font-semibold">
                <i className="fas fa-phone mr-2"></i>02-2634-2023
              </a>
              <a href="mailto:forthefreedom2025@naver.com" className="text-primary font-semibold">
                <i className="fas fa-envelope mr-2"></i>forthefreedom2025@naver.com
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/en" className="text-primary hover:underline">
              <i className="fas fa-home mr-2"></i>Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
