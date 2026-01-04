import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Party Platform | Freedom & Innovation',
  description: 'Freedom & Innovation 7 Core Policies. Economic growth, education innovation, national security policies.',
  openGraph: {
    title: 'Party Platform | Freedom & Innovation',
    description: 'Freedom & Innovation 7 Core Policies',
    url: 'https://forthefreedom.kr/en/about/policy',
  },
}

const policies = [
  {
    number: 'One',
    icon: 'fa-balance-scale',
    color: 'bg-primary',
    title: 'A Party Pursuing Justice, Fairness, and Hope',
    description: 'Breaking the chains of privilege and corruption, creating a society equal before the law'
  },
  {
    number: 'Two',
    icon: 'fa-vote-yea',
    color: 'bg-blue-600',
    title: 'Eradicate Election Fraud',
    description: 'Abolish early voting, establish same-day voting and counting principles'
  },
  {
    number: 'Three',
    icon: 'fa-shield-alt',
    color: 'bg-green-600',
    title: 'Strengthen National Security',
    description: 'Eliminate anti-national forces, restore counter-intelligence powers'
  },
  {
    number: 'Four',
    icon: 'fa-microchip',
    color: 'bg-purple-600',
    title: '4th Industrial Revolution',
    description: 'Foster AI, robotics, and quantum computing as strategic industries'
  },
  {
    number: 'Five',
    icon: 'fa-rocket',
    color: 'bg-orange-600',
    title: 'Youth Opportunity Ladder',
    description: 'Fast-track for young talents, fair opportunities for all'
  },
  {
    number: 'Six',
    icon: 'fa-handshake',
    color: 'bg-indigo-600',
    title: 'Foundation for Free Unification',
    description: 'Prepare for peaceful unification, train 100,000 unification specialists'
  },
  {
    number: 'Seven',
    icon: 'fa-paint-brush',
    color: 'bg-pink-600',
    title: 'Cultural Prosperity',
    description: 'Become a global cultural powerhouse through K-content'
  }
]

export default function PolicyPageEn() {
  return (
    <div>
      {/* Hero Section */}
      <section 
        className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">Party Platform</h1>
          <p className="text-xl md:text-2xl text-gray-200 drop-shadow">Liberal Democracy and Innovative Future for Korea</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* Party Identity */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Party Platform</h2>
              <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
            </div>
            
            <div className="bg-red-50 border-l-8 border-primary p-10 rounded-lg mb-12">
              <h3 className="text-2xl font-bold text-red-800 mb-6">Party Identity</h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                Freedom & Innovation is a people-centered party that defends Korea&apos;s liberal democratic system, 
                market economy principles, and rule of law, while pursuing development across politics, 
                economy, society, education, and culture through continuous innovation.
              </p>
            </div>
          </div>
        </section>

        {/* 7 Core Policies */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-lg font-medium text-primary tracking-wider uppercase mb-4">7 CORE POLICIES</h2>
              <h3 className="text-4xl font-bold text-gray-900">
                Our Vision for a <span className="text-primary">New Korea</span>
              </h3>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {policies.map((policy, idx) => (
                <div key={idx} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 ${policy.color} rounded-full flex items-center justify-center mb-4`}>
                    <i className={`fas ${policy.icon} text-white text-xl`}></i>
                  </div>
                  <div className="text-sm text-primary font-semibold mb-2">{policy.number}</div>
                  <h4 className="text-xl font-bold text-gray-900 mb-3">{policy.title}</h4>
                  <p className="text-gray-600">{policy.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Build the Future Together</h2>
            <p className="text-xl text-red-100 mb-8 max-w-6xl mx-auto">
              Join us in defending liberal democracy and building an innovative nation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3" 
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join Party <i className="fas fa-arrow-right ml-2"></i>
              </a>
              <Link 
                href="/en/support"
                className="inline-flex items-center px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                Donate <i className="fas fa-heart ml-2"></i>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
