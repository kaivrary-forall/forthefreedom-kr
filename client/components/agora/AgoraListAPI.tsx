'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

interface Author {
  _id: string
  nickname: string
  memberType?: string
  profileImage?: string
}

interface Post {
  _id: string
  boardType: string
  author: Author
  title: string
  content: string
  viewCount: number
  likeCount: number
  dislikeCount: number
  commentCount: number
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function AgoraListAPI() {
  const { isLoggedIn } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/agora?page=${currentPage}&limit=20`)
        const data = await response.json()
        
        if (data.success) {
          setPosts(data.posts || [])
          setPagination(data.pagination || null)
        }
      } catch (error) {
        console.error('게시글 로드 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadPosts()
  }, [currentPage])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) return '방금 전'
    if (hours < 24) return `${hours}시간 전`
    
    return date.toLocaleDateString('ko-KR', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded-lg h-20 animate-pulse" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">📝</span>
        </div>
        <p className="text-lg">아직 게시글이 없습니다.</p>
        <p className="text-sm mt-2">첫 번째 글을 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div>
      {/* 상단 글쓰기 버튼 */}
      <div className="flex justify-end mb-4">
        <Link
          href={isLoggedIn ? '/agora/write' : '/login?return=/agora/write'}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
        >
          ✏️ 글쓰기
        </Link>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">제목</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-28 hidden sm:table-cell">작성자</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-20 hidden md:table-cell">조회</th>
              <th className="px-4 py-4 text-center text-sm font-semibold text-gray-900 w-24">날짜</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <Link 
                    href={`/agora/${post._id}`}
                    className="block hover:text-primary transition-colors"
                  >
                    <span className="font-medium text-gray-900 line-clamp-1">
                      {post.title}
                    </span>
                    {post.commentCount > 0 && (
                      <span className="ml-2 text-primary text-sm">[{post.commentCount}]</span>
                    )}
                  </Link>
                </td>
                <td className="px-4 py-4 text-center hidden sm:table-cell">
                  <div className="flex items-center justify-center gap-2">
                    {post.author.profileImage && (
                      <img 
                        src={post.author.profileImage} 
                        alt={post.author.nickname}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    )}
                    <span className="text-sm text-gray-600 truncate max-w-[80px]">
                      {post.author.nickname}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-500 hidden md:table-cell">
                  {post.viewCount}
                </td>
                <td className="px-4 py-4 text-center text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← 이전
          </button>
          
          {/* 페이지 번호들 */}
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(currentPage - 2 + i, pagination.totalPages - 4 + i))
              if (pageNum < 1 || pageNum > pagination.totalPages) return null
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-lg ${
                    currentPage === pageNum
                      ? 'bg-primary text-white'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>
          
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
            disabled={currentPage === pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            다음 →
          </button>
        </div>
      )}

      {/* 총 게시글 수 */}
      {pagination && (
        <p className="text-center text-sm text-gray-500 mt-4">
          총 {pagination.total}개의 게시글
        </p>
      )}
    </div>
  )
}
