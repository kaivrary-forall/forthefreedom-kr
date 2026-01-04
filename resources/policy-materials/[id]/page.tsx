import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

// TODO: API 연동 후 실제 데이터로 교체
const policyMaterials: Record<string, { title: string; date: string; content: string }> = {}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params
  const item = policyMaterials[id]
  
  return {
    title: item ? `${item.title} | 정책자료 | 자유와혁신` : '정책자료 | 자유와혁신',
  }
}

export default async function PolicyMaterialDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const item = policyMaterials[id]

  // 데이터가 없으면 준비중 페이지 표시 (404 대신)
  if (!item) {
    return (
      <div>
        <section className="bg-gray-50 py-8 mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm">
              <ol className="list-none p-0 inline-flex space-x-2">
                <li className="flex items-center">
                  <Link href="/" className="text-gray-500 hover:text-primary">홈</Link>
                  <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
                </li>
                <li className="flex items-center">
                  <Link href="/resources" className="text-gray-500 hover:text-primary">자료실</Link>
                  <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
                </li>
                <li className="flex items-center">
                  <Link href="/resources/policy-materials" className="text-gray-500 hover:text-primary">정책자료</Link>
                  <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
                </li>
                <li className="text-gray-900">상세</li>
              </ol>
            </nav>
          </div>
        </section>

        <main className="bg-white py-16">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <div className="text-gray-300 mb-6">
              <i className="fas fa-file-alt text-6xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">자료를 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-8">
              요청하신 정책자료가 존재하지 않거나 준비 중입니다.
            </p>
            <Link 
              href="/resources/policy-materials"
              className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              정책자료 목록으로
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div>
      <section className="bg-gray-50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex space-x-2">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-primary">홈</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link href="/resources" className="text-gray-500 hover:text-primary">자료실</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link href="/resources/policy-materials" className="text-gray-500 hover:text-primary">정책자료</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="text-gray-900">{item.title}</li>
            </ol>
          </nav>
        </div>
      </section>

      <main className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <article>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.title}</h1>
              <p className="text-gray-500">{item.date}</p>
            </header>
            <div className="prose max-w-none">
              {item.content}
            </div>
          </article>
          
          <div className="mt-12 text-center">
            <Link 
              href="/resources/policy-materials"
              className="text-primary hover:underline"
            >
              <i className="fas fa-arrow-left mr-2"></i>목록으로
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
