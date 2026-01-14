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
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <div 
                  key={item._id}
                  className="bg-white border-l-4 border-primary rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      item.type === '임명' ? 'bg-blue-100 text-blue-800' : 
                      item.type === '전보' ? 'bg-yellow-100 text-yellow-800' : 
                      item.type === '퇴임' ? 'bg-gray-100 text-gray-800' :
                      item.type === '승진' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {item.type}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(item.effectiveDate) || formatDate(item.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-300 mb-4">
                <i className="fas fa-user-tie text-6xl"></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">등록된 인사공고가 없습니다</h3>
              <p className="text-gray-500">새로운 인사공고가 등록되면 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
