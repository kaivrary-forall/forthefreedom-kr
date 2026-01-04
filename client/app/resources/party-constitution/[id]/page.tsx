import type { Metadata } from 'next'
import Link from 'next/link'

// TODO: API 연동 후 실제 데이터로 교체
const constitutionDocs: Record<string, { title: string; date: string; content: string }> = {}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const { id } = await params
  const item = constitutionDocs[id]
  
  return {
    title: item ? `${item.title} | 당헌당규 | 자유와혁신` : '당헌당규 | 자유와혁신',
  }
}

export default async function PartyConstitutionDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params
  const item = constitutionDocs[id]

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
                  <Link href="/resources/party-constitution" className="text-gray-500 hover:text-primary">당헌당규</Link>
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
              <i className="fas fa-balance-scale text-6xl"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">문서를 찾을 수 없습니다</h1>
            <p className="text-gray-600 mb-4">
              요청하신 당헌당규 문서가 존재하지 않거나 준비 중입니다.
            </p>
            <p className="text-gray-600 mb-8">
              당헌·당규 전문은 아래 페이지에서 확인하실 수 있습니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/about/principles"
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <i className="fas fa-book mr-2"></i>
                강령·당헌·당규 보기
              </Link>
              <Link 
                href="/resources/party-constitution"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                당헌당규 목록으로
              </Link>
            </div>
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
                <Link href="/resources/party-constitution" className="text-gray-500 hover:text-primary">당헌당규</Link>
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
              href="/resources/party-constitution"
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
