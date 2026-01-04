import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resources | Freedom & Innovation',
  description: 'Freedom & Innovation resources and downloads.',
}

const resourceCategories = [
  {
    title: 'Policy Materials',
    icon: 'fa-file-alt',
    href: '/en/resources/policy-materials',
    description: 'Policy documents',
    color: 'bg-blue-500',
  },
  {
    title: 'Election Materials',
    icon: 'fa-vote-yea',
    href: '/en/resources/election-materials',
    description: 'Election documents',
    color: 'bg-red-500',
  },
  {
    title: 'Party Constitution',
    icon: 'fa-book',
    href: '/en/resources/party-constitution',
    description: 'Charter and rules',
    color: 'bg-purple-500',
  },
  {
    title: 'Downloads',
    icon: 'fa-download',
    href: '/en/resources/downloads',
    description: 'Logos and images',
    color: 'bg-green-500',
  },
]

export default function ResourcesPage() {
  return (
    <div>
      <section 
        className="relative h-[40vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Resources</h1>
          <p className="text-xl text-gray-200 drop-shadow">Documents & Downloads</p>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {resourceCategories.map((cat) => (
              <Link 
                key={cat.title}
                href={cat.href}
                className="bg-white border-2 border-gray-100 rounded-xl p-8 hover:shadow-lg transition-all"
              >
                <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <i className={`fas ${cat.icon} text-white text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                <p className="text-gray-600">{cat.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/en" className="text-primary hover:underline">
              <i className="fas fa-home mr-2"></i>Back to Home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
