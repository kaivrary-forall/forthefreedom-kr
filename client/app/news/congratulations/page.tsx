'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Congratulation {
  _id: string
  type: string
  title: string
  content: string
  targetName: string
  eventDate: string
  location?: string
}

export default function CongratulationsPage() {
  const [items, setItems] = useState<Congratulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'happy' | 'sad'>('all')

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/congratulations')
        const result = await res.json()
        if (result.success) setItems(result.data || [])
      } catch (error) {
        console.error('경조사 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  
  const getTypeEmoji = (type: string) => {
    switch(type) {
      case '결혼': return '💒'
      case '출산': return '👶'
      case '돌잔치': return '🎂'
      case '회갑': return '🎊'
      case '칠순': return '🎉'
      case '조의': return '🕯️'
      default: return '📢'
    }
  }

  const isSadType = (type: string) => type === '조의'

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true
    if (filter === 'happy') return !isSadType(item.type)
    if (filter === 'sad') return isSadType(item.type)
    return true
  })

  return (
    <div>
      {/* 브레드크럼 */}
      <section className="bg-gray-50 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-sm">
            <ol className="list-none p-0 inline-flex space-x-2">
              <li className="flex items-center">
                <Link href="/" className="text-gray-500 hover:text-primary">홈</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="flex items-center">
                <Link href="/news/notices" className="text-gray-500 hover:text-primary">정당소식</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400"></i>
              </li>
              <li className="text-gray-900">경조사</li>
            </ol>
          </nav>
        </div>
      </section>

      <main className="bg-white">
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">경조사</h1>
              <p className="text-xl text-gray-600">당원 여러분의 기쁨과 슬픔을 함께 나눕니다</p>
            </div>

            {/* 필터 버튼 */}
            <div className="mb-6 flex flex-wrap gap-3 justify-center">
              <button 
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-full border text-sm transition ${filter === 'all' ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'}`}
              >
                <i className="fas fa-list mr-2"></i>전체
              </button>
              <button 
                onClick={() => setFilter('happy')}
                className={`px-4 py-2 rounded-full border text-sm transition ${filter === 'happy' ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'}`}
              >
                <i className="fas fa-gift mr-2"></i>경사
              </button>
              <button 
                onClick={() => setFilter('sad')}
                className={`px-4 py-2 rounded-full border text-sm transition ${filter === 'sad' ? 'border-primary bg-primary text-white' : 'border-gray-300 bg-white text-gray-700 hover:border-primary hover:text-primary'}`}
              >
                <i className="fas fa-ribbon mr-2"></i>조사
              </button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="space-y-4">
                {filteredItems.map((item) => (
                  <div 
                    key={item._id}
                    className={`bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all hover:-translate-y-0.5 border-l-4 ${
                      isSadType(item.type) ? 'border-gray-400' : 'border-yellow-500'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        isSadType(item.type) ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {getTypeEmoji(item.type)} {item.type}
                      </span>
                      <span className="text-gray-500 text-sm">{formatDate(item.eventDate)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 mb-2 whitespace-pre-wrap">{item.content}</p>
                    {item.location && (
                      <p className="text-sm text-gray-500"><i className="fas fa-map-marker-alt mr-1"></i> {item.location}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-300 mb-4">
                  <i className="fas fa-heart text-6xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">등록된 경조사가 없습니다</h3>
                <p className="text-gray-500">새로운 경조사 소식이 등록되면 여기에 표시됩니다.</p>
              </div>
            )}

            <div className="mt-12 text-center">
              <Link href="/news/notices" className="text-primary hover:underline">
                <i className="fas fa-arrow-left mr-2"></i>소식으로 돌아가기
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
