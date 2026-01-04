import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Location | Freedom & Innovation',
  description: 'Freedom & Innovation Central Party location. 19 Cheongpa-ro 45-gil, Yongsan-gu, Seoul',
}

export default function LocationPageEn() {
  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[50vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Location</h1>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">How to Find Us</h2>
              <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                Visit our central party office in Seoul.
              </p>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border-l-4 border-primary">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center mb-3">
                    <div className="w-3 h-3 bg-primary rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-2xl font-bold text-gray-900">Freedom &amp; Innovation HQ</h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">19 Cheongpa-ro 45-gil, Yongsan-gu, Seoul</p>
                  <p className="text-gray-500">Room 301, Bokjo Building</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="tel:+82-2-2634-2023" 
                    className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    <i className="fas fa-phone mr-2"></i> Call
                  </a>
                  <a 
                    href="mailto:forthefreedom2025@naver.com" 
                    className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <i className="fas fa-envelope mr-2"></i> Email
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-12">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.5!2d126.9699!3d37.5463!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca257a50a1b1b%3A0x1234567890!2z7ISc7Jq4IOyaqeywnOq1rCDssq3quqzroZw0Neq4uCAxOQ!5e0!3m2!1sko!2skr!4v1234567890"
                width="100%" 
                height="450" 
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>

            {/* Transportation */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-subway text-blue-600 text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900">Subway</h3>
                </div>
                <p className="text-sm text-gray-700">Line 4: Sookmyung Women&apos;s Univ. Station (Exit 8)</p>
                <p className="text-sm text-gray-700">Line 1: Namyeong Station / Seoul Station</p>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-taxi text-green-600 text-xl"></i>
                  </div>
                  <h3 className="font-bold text-gray-900">Taxi</h3>
                </div>
                <p className="text-sm text-gray-700">About 10 minutes from Seoul Station</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Visit Us</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="px-8 py-3 bg-white text-primary font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Join Party
              </a>
              <Link 
                href="/en/support"
                className="px-8 py-3 border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-primary transition-colors"
              >
                Donate
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
