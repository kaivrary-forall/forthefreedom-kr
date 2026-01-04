import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Logo | Freedom & Innovation',
  description: 'The symbol and logo representing the identity and values of Freedom & Innovation.',
}

export default function LogoPageEn() {
  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Our Logo</h1>
          <p className="text-xl text-gray-200 drop-shadow">The symbol representing our identity and values</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Symbol &amp; Logo</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mb-16">
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <div className="bg-white p-8 rounded-xl mb-6 shadow-sm">
                  <Image 
                    src="/images/logo.png" 
                    alt="Freedom & Innovation Primary Logo" 
                    width={300}
                    height={128}
                    className="mx-auto h-32 w-auto object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Primary Logo</h4>
                <p className="text-gray-600">
                  The primary logo for general use.
                </p>
              </div>
              
              <div className="bg-gray-50 p-8 rounded-2xl text-center">
                <div className="bg-white p-8 rounded-xl mb-6 shadow-sm">
                  <Image 
                    src="/images/logo-symbol.png" 
                    alt="Freedom & Innovation Symbol" 
                    width={128}
                    height={128}
                    className="mx-auto h-32 w-auto object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">Symbol</h4>
                <p className="text-gray-600">
                  The symbol for limited space applications.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Freedom &amp; Innovation</h2>
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
