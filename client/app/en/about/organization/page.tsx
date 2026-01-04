import type { Metadata } from 'next'
import { organizationDataEn, tabsEn } from '@/data/organization.en'
import OrganizationChart from '@/components/OrganizationChart'

export const metadata: Metadata = {
  title: 'Organization | Freedom & Innovation',
  description: 'Freedom & Innovation organization chart. View our central party, committees, and regional chapters.',
  openGraph: {
    title: 'Organization | Freedom & Innovation',
    description: 'Freedom & Innovation organization chart.',
    url: 'https://forthefreedom.kr/en/about/organization',
  },
}

export default function OrganizationPageEn() {
  return (
    <div>
      {/* Header */}
      <section className="py-8 bg-white border-b mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Organization Chart</h1>
        </div>
      </section>
      
      {/* Organization Chart */}
      <OrganizationChart data={organizationDataEn} tabs={tabsEn} />
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
          <p className="text-lg mb-8 opacity-90">
            We are looking for talented and passionate individuals to build the future of Korea together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank" rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              Join Party
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
