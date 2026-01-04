import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | Freedom & Innovation',
}

export default function TermsPage() {
  return (
    <div>
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Terms of Service</h1>
        </div>
      </section>
      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Purpose</h2>
            <p className="text-gray-600 mb-4">
              These terms govern the use of services provided by Freedom & Innovation ("the Party") through its website.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Services</h2>
            <p className="text-gray-600 mb-4">The Party provides the following services:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Party information and policy announcements</li>
              <li>News and updates</li>
              <li>Membership and donation information</li>
              <li>Resources and media services</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">3. User Obligations</h2>
            <p className="text-gray-600 mb-4">Users shall not:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Misuse others' personal information</li>
              <li>Interfere with website operations</li>
              <li>Violate applicable laws</li>
              <li>Act against public order</li>
            </ul>
            <p className="text-sm text-gray-500 mt-8">Effective Date: July 1, 2025</p>
          </div>
          <div className="mt-12 text-center">
            <Link href="/en" className="text-primary hover:underline"><i className="fas fa-home mr-2"></i>Back to Home</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
