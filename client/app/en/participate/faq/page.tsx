import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'FAQ | Freedom & Innovation',
  description: 'Frequently asked questions about Freedom & Innovation membership.',
}

const faqItems = [
  {
    q: 'Who can join?',
    a: 'Any Korean citizen aged 18 or above who is not a member of another political party can join.',
  },
  {
    q: 'How much are membership dues?',
    a: 'Membership dues are voluntary. You can choose the amount that works for you.',
  },
  {
    q: 'What activities can members participate in?',
    a: 'Members can participate in regional meetings, policy discussions, volunteer activities, and election campaigns.',
  },
  {
    q: 'How do I leave the party?',
    a: 'You can submit a withdrawal form to the Organization Department at any time.',
  },
]

export default function FaqPage() {
  return (
    <div>
      <section className="bg-gray-900 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-white">FAQ</h1>
          <p className="text-gray-400 mt-2">Frequently Asked Questions</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="space-y-6">
            {faqItems.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 mb-3">
                  <i className="fas fa-question-circle text-primary mr-2"></i>
                  {item.q}
                </h3>
                <p className="text-gray-600 pl-6">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-primary/5 rounded-xl p-8 text-center">
            <h3 className="font-bold text-gray-900 mb-4">Have more questions?</h3>
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
            <Link href="/en/participate/join" className="text-primary hover:underline">
              <i className="fas fa-arrow-left mr-2"></i>Back to Join
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
