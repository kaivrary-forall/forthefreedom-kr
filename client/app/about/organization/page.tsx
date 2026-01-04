import type { Metadata } from 'next'
import { organizationData, tabs } from '@/data/organization.ko'
import OrganizationChart from '@/components/OrganizationChart'

export const metadata: Metadata = {
  title: '조직도 | 자유와혁신',
  description: '자유와혁신 조직도. 중앙당, 직능위원회, 시도당 조직 현황을 확인하세요.',
  openGraph: {
    title: '조직도 | 자유와혁신',
    description: '자유와혁신 조직도. 중앙당, 직능위원회, 시도당 조직 현황을 확인하세요.',
    url: 'https://forthefreedom.kr/about/organization',
  },
}

export default async function OrganizationPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const params = await searchParams
  const initialTab = params.tab || ''
  
  return (
    <div>
      {/* 헤더 */}
      <section className="py-8 bg-white border-b mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">자유와혁신 조직도</h1>
        </div>
      </section>
      
      {/* 조직도 */}
      <OrganizationChart data={organizationData} tabs={tabs} initialTab={initialTab} />
      
      {/* CTA 섹션 */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">함께할 인재를 찾습니다</h2>
          <p className="text-lg mb-8 opacity-90">
            자유와혁신과 함께 대한민국의 미래를 만들어갈 유능하고 열정적인 인재를 기다리고 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
              target="_blank" rel="noopener noreferrer"
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
            >
              당원가입
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
