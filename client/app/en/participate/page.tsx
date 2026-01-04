import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Participate | Freedom & Innovation',
  description: 'Join and participate in Freedom & Innovation activities.',
}

const participateCards = [
  {
    icon: 'fa-user-plus',
    title: 'Join Us',
    description: 'Become a party member',
    href: '/en/participate/join',
    color: 'bg-primary',
  },
  {
    icon: 'fa-question-circle',
    title: 'FAQ',
    description: 'Frequently asked questions',
    href: '/en/participate/faq',
    color: 'bg-blue-600',
  },
  {
    icon: 'fa-heart',
    title: 'Donate',
    description: 'Support our mission',
    href: '/en/support',
    color: 'bg-red-600',
  },
  {
    icon: 'fa-hands-helping',
    title: 'Volunteer',
    description: 'Join Freedom Action',
    href: '/en/participate/volunteer',
    color: 'bg-green-600',
  },
]

export default function ParticipatePage() {
  return (
    <div>
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/flag-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Participate</h1>
          <p className="text-xl text-gray-200 drop-shadow">Join the Movement</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {participateCards.map((card) => (
              <Link 
                key={card.title}
                href={card.href}
                className="bg-white border-2 border-gray-100 rounded-xl p-8 hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`fas ${card.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-600">{card.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-user-plus"></i>
              Join Online Now
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
