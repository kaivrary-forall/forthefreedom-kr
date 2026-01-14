'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import NewsTabs from '@/components/news/NewsTabs'

interface Personnel {
  _id: string
  type: string
  title: string
  content: string
  effectiveDate: string
  createdAt: string
  views?: number
}

export default function PersonnelPage() {
  const [items, setItems] = useState<Personnel[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/personnel')
        const result = await res.json()
        if (result.success) setItems(result.data || [])
      } catch (error) {
        console.error('인사공고 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    if (isNaN(date.getTime())) return ''
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  return (
    <div>
      <NewsTabs active="personnel" />
      <main className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-xl h-32 animate-pulse" />
              ))}
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="block bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="flex gap-6">
                    <div className="hidden sm:flex w-40 h-28 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 items-center justify-center flex-shrink-0">
                      <span className="text-3xl">📋</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${
                          item.type === '임명' ? 'bg-blue-100 text-blue-800' : 
                          item.type === '전보' ? 'bg-yellow-100 text-yellow-800' : 
                          item.type === '퇴임' ? 'bg-gray-100 text-gray-800' :
                          item.type === '승진' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                        {item.title}
                      </h2>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {item.content?.slice(0, 150)}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{formatDate(item.effectiveDate) || formatDate(item.createdAt)}</span>
                        {item.views !== undefined && <span>조회 {item.views}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">등록된 인사공고가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
