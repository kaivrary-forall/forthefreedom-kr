import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Founding Story | Freedom & Innovation',
  description: 'The founding story of Freedom & Innovation party.',
  openGraph: {
    title: 'Founding Story | Freedom & Innovation',
    description: 'The founding story of Freedom & Innovation party.',
    url: 'https://forthefreedom.kr/en/about/founding',
  },
}

const timeline = [
  {
    date: 'June 1, 2025',
    title: 'Founding Declaration at Gwanghwamun',
    description: 'Chairman Hwang Kyo-ahn announced the founding of the party at Gwanghwamun Square, pledging to eradicate election fraud and protect liberal democracy.',
    color: 'bg-primary'
  },
  {
    date: 'June 6, 2025',
    title: 'Central Party Founders Meeting',
    description: 'On Memorial Day, the founders meeting was held at Gwanghwamun, marking the birth of a new conservative party inheriting the founding spirit of Korea.',
    color: 'bg-primary-dark'
  },
  {
    date: 'June 2025',
    title: 'Nationwide Regional Founders Meetings',
    description: 'Founders meetings were held across all 17 major cities and provinces including Seoul, Busan, Daegu, and more.',
    color: 'bg-red-700'
  },
  {
    date: 'July 12, 2025',
    title: 'Central Party Founding Convention',
    description: 'The founding convention was held at KINTEX, where Chairman Hwang Kyo-ahn was elected as the first party leader.',
    color: 'bg-red-800'
  }
]

export default function FoundingPageEn() {
  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Our New Beginning</h1>
          <p className="text-xl text-gray-200 drop-shadow">The Founding Story of Freedom &amp; Innovation</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* Intro */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Founding Story</h2>
            <p className="text-xl text-gray-600 max-w-6xl mx-auto leading-relaxed">
              The journey of founding Freedom &amp; Innovation to defend Korea&apos;s liberal democracy and eradicate election fraud.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-8">
              {timeline.map((item, idx) => (
                <div key={idx} className={`bg-white p-8 rounded-lg shadow-lg border-l-4 ${item.color.replace('bg-', 'border-')}`}>
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 ${item.color} rounded-full mr-3`}></div>
                    <span className="text-primary font-bold">{item.date}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Make History With Us</h2>
            <p className="text-xl text-red-100 mb-8">
              Join Freedom &amp; Innovation in building a new future for Korea
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join Party
              </a>
              <Link 
                href="/en/about"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
