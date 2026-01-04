'use client'

import { useState } from 'react'
import Link from 'next/link'

type TabType = 'platform' | 'charter' | 'rules'

const tabs: { id: TabType; name: string; icon: string }[] = [
  { id: 'platform', name: 'Platform', icon: 'fa-flag' },
  { id: 'charter', name: 'Charter', icon: 'fa-book' },
  { id: 'rules', name: 'Rules', icon: 'fa-gavel' }
]

const declarations = [
  'Pursue a party of justice, fairness, and hope.',
  'Eradicate election fraud and ensure transparency in the electoral system.',
  'Strengthen national security and social integrity.',
  'Achieve future advancement through the 4th Industrial Revolution.',
  'Build a ladder of hope for youth.',
  'Establish the foundation for free unification.',
  'Realize a happy Korea through cultural prosperity.'
]

const numberWords = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven']

export default function PrinciplesPageEn() {
  const [activeTab, setActiveTab] = useState<TabType>('platform')

  return (
    <div>
      {/* Hero */}
      <section 
        className="relative h-[60vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/night-pic.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">Platform · Charter · Rules</h1>
          <p className="text-xl text-gray-200 drop-shadow">National reconstruction through liberal democracy and innovation</p>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* Tab Navigation */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <div className="bg-gray-50 p-1 rounded-lg">
                <div className="flex space-x-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-8 py-3 rounded-md font-semibold text-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-primary text-white'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <i className={`fas ${tab.icon} mr-2`}></i>{tab.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Content */}
        {activeTab === 'platform' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="fas fa-flag text-primary text-4xl"></i>
                </div>
                <p className="text-xl text-gray-600 max-w-6xl mx-auto">
                  The platform of Freedom &amp; Innovation contains the party&apos;s basic ideology and policy direction.
                </p>
              </div>

              {/* 7 Declarations */}
              <div className="mb-16">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Our Declaration for a New Korea</h3>
                <div className="space-y-4 max-w-6xl mx-auto">
                  {declarations.map((declaration, idx) => (
                    <div key={idx} className="flex items-start">
                      <span className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-bold text-sm rounded-full mr-4 flex-shrink-0 mt-1">
                        {numberWords[idx]}
                      </span>
                      <p className="text-gray-700 leading-relaxed pt-2">{declaration}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Link 
                  href="/en/about/policy"
                  className="inline-flex items-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
                >
                  View 7 Core Policies <i className="fas fa-arrow-right ml-2"></i>
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Charter Content */}
        {activeTab === 'charter' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-book text-primary text-4xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Party Charter</h2>
              <p className="text-xl text-gray-600 mb-8">
                The charter contains basic regulations on the organization and operation of the party.
              </p>
              <p className="text-gray-500">Please refer to the official party documents for detailed charter content.</p>
            </div>
          </section>
        )}

        {/* Rules Content */}
        {activeTab === 'rules' && (
          <section className="py-12 bg-white">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <i className="fas fa-gavel text-primary text-4xl"></i>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Party Rules</h2>
              <p className="text-xl text-gray-600 mb-8">
                The rules contain detailed regulations for the implementation of the charter.
              </p>
              <p className="text-gray-500">Please refer to the official party documents for detailed rules.</p>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Join Freedom &amp; Innovation</h2>
            <p className="text-xl text-red-100 mb-8">
              Defending liberal democracy and creating an innovative future for Korea
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
