import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | Freedom & Innovation',
}

export default function PrivacyPage() {
  return (
    <div>
      <section className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
        </div>
      </section>
      <main className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose max-w-none">
            <p className="text-gray-600 mb-8">
              Freedom & Innovation ("the Party") protects personal information in accordance with the Personal Information Protection Act.
            </p>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">1. Purpose of Processing Personal Information</h2>
            <p className="text-gray-600 mb-4">The Party processes personal information for the following purposes:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
              <li>Member registration and management</li>
              <li>Donation processing and management</li>
              <li>Party activity notifications</li>
              <li>Inquiry handling</li>
            </ul>
            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4">2. Contact Information</h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Privacy Officer</strong><br />
                Department: Secretariat<br />
                Phone: 02-2634-2023<br />
                Email: forthefreedom2025@naver.com
              </p>
            </div>
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
