import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About | Freedom & Innovation',
  description: 'Freedom & Innovation is a political party that defends liberal democracy and fights against election fraud and anti-national forces.',
}

export default function AboutPageEn() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Us</h1>
          <p className="text-xl text-gray-200">Defending Liberal Democracy</p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">About Freedom & Innovation</h2>
            
            <p className="text-gray-600 mb-6">
              Freedom & Innovation is a political party established to defend 
              the liberal democratic system of the Republic of Korea and to 
              eradicate election fraud and anti-national forces.
            </p>

            <p className="text-gray-600 mb-6">
              Based on the spirit of the Constitution, we aim to guarantee 
              the freedom and rights of the people and realize the fundamental 
              values of democracy through fair and transparent elections.
            </p>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">Core Values</h3>
            
            <div className="grid md:grid-cols-3 gap-6 not-prose">
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-flag text-xl text-primary"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Defend Liberal Democracy</h4>
                <p className="text-sm text-gray-600">We defend the liberal democratic system based on the spirit of the Korean Constitution.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-search text-xl text-primary"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Eradicate Election Fraud</h4>
                <p className="text-sm text-gray-600">We eradicate election fraud for fair and transparent elections.</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <i className="fas fa-shield-alt text-xl text-primary"></i>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Fight Anti-National Forces</h4>
                <p className="text-sm text-gray-600">We fight against forces that threaten the identity of the Republic of Korea.</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mt-12 mb-6">History</h3>
            
            <div className="space-y-4 not-prose">
              <div className="flex gap-4">
                <div className="w-24 text-primary font-bold">2025.06.06</div>
                <div className="text-gray-600">Freedom & Innovation founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
