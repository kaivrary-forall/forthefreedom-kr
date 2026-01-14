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
      
    </div>
  )
}
