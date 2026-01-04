import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCommittee, committees } from '@/data/committees'

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params
  const committee = getCommittee(slug)
  
  if (!committee) {
    return { title: '위원회 | 자유와혁신' }
  }
  
  return {
    title: `${committee.name} | 자유와혁신`,
    description: committee.description,
  }
}

export async function generateStaticParams() {
  return committees.map((c) => ({ slug: c.slug }))
}

export default async function CommitteePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const committee = getCommittee(slug)

  if (!committee) {
    notFound()
  }

  return (
    <div>
      {/* 히어로 */}
      <section 
        className="relative pt-28 pb-16"
        style={{ background: `linear-gradient(135deg, ${committee.color} 0%, ${committee.color}99 100%)` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-white">
            <div className="text-center md:text-left mb-8 md:mb-0">
              <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 text-sm mb-4">
                <i className={`fas ${committee.icon}`}></i>
                <span>자유와혁신 직능위원회</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{committee.name}</h1>
              <p className="text-xl text-white/90">{committee.description}</p>
            </div>
            <div className="w-32 h-32 md:w-48 md:h-48 bg-white/20 rounded-full flex items-center justify-center">
              <i className={`fas ${committee.icon} text-6xl md:text-8xl text-white/80`}></i>
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 bg-white">
        {/* 소개 */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">위원회 소개</h2>
              <p className="text-lg text-gray-600">
                {committee.name}은 자유와혁신의 직능위원회로서<br />
                {committee.description}을 위해 활동합니다.
              </p>
            </div>

            {/* 주요 활동 */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${committee.color}20` }}
                >
                  <i className="fas fa-bullhorn text-xl" style={{ color: committee.color }}></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">정책 제안</h3>
                <p className="text-sm text-gray-600">관련 분야 정책 연구 및 제안</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${committee.color}20` }}
                >
                  <i className="fas fa-users text-xl" style={{ color: committee.color }}></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">네트워크</h3>
                <p className="text-sm text-gray-600">관련 분야 전문가 네트워크 구축</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl text-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${committee.color}20` }}
                >
                  <i className="fas fa-calendar-alt text-xl" style={{ color: committee.color }}></i>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">행사 개최</h3>
                <p className="text-sm text-gray-600">세미나, 토론회 등 행사 주최</p>
              </div>
            </div>
          </div>
        </section>

        {/* 가입 안내 */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{committee.name} 가입</h2>
            <p className="text-gray-600 mb-8">
              {committee.name}에 관심 있으신 분은 당원가입 후 위원회 가입을 신청해 주세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-user-plus"></i>
                당원가입
              </a>
              <a 
                href="tel:02-2634-2023"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-phone"></i>
                문의하기
              </a>
            </div>
          </div>
        </section>

        {/* 네비게이션 */}
        <section className="py-8 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Link 
              href="/about/organization?tab=committee"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <i className="fas fa-arrow-left"></i>
              전체 위원회 보기
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
