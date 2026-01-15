'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

// 멘션 드롭다운 컴포넌트
function MentionDropdown({ 
  nickname, 
  children,
  className = ''
}: { 
  nickname: string
  children: React.ReactNode
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <span className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="hover:underline cursor-pointer"
      >
        {children}
      </button>
      
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[140px] py-1">
          <Link
            href={`/member/${encodeURIComponent(nickname)}`}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>👤</span>
            <span>프로필 보기</span>
          </Link>
          <Link
            href={`/member/${encodeURIComponent(nickname)}/posts`}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>📝</span>
            <span>작성한 글</span>
          </Link>
          <Link
            href={`/member/${encodeURIComponent(nickname)}/comments`}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>💬</span>
            <span>작성한 댓글</span>
          </Link>
          <Link
            href={`/member/${encodeURIComponent(nickname)}/mentions`}
            className="flex items-center gap-2 px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <span>📢</span>
            <span>언급된 글</span>
          </Link>
        </div>
      )}
    </span>
  )
}

interface Author {
  _id: string
  nickname: string
  memberType?: string
  profileImage?: string
}

interface Post {
  _id: string
  boardType: string
  author: Author | null
  authorIp?: string // 익명 게시판용 IP
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

interface AgoraListAPIProps {
  boardType?: 'member' | 'party' | 'innovation' | 'anonymous'
}

// IP 마스킹 함수 (123.456.789.012 → 123.456.***.***) 
function maskIp(ip: string): string {
  if (!ip) return '알 수 없음'
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.*.*`
  }
  // IPv6 등 다른 형식
  return ip.substring(0, Math.min(10, ip.length)) + '***'
}

export default function AgoraListAPI({ boardType = 'member' }: AgoraListAPIProps) {
  const { isLoggedIn, member } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  // boardType 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1)
  }, [boardType])

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/agora?page=${currentPage}&limit=20&boardType=${boardType}`)
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
  }, [currentPage, boardType])

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

  // 글쓰기 권한 체크
  const canWrite = () => {
    // 로그인 안 되어 있으면 권한 없음
    if (!isLoggedIn) return false
    
    // 회원 게시판은 로그인만 되어 있으면 OK
    if (boardType === 'member') {
      return true
    }
    
    // 당원/혁신당원/익명 게시판은 memberType 체크
    const memberType = (member as any)?.memberType || 'member'
    
    switch (boardType) {
      case 'party':
      case 'anonymous': // 익명도 당원 이상만
        return ['party_member', 'innovation_member', 'admin'].includes(memberType)
      case 'innovation':
        return ['innovation_member', 'admin'].includes(memberType)
      default:
        return false
    }
  }

  // 글쓰기 URL
  const getWriteUrl = () => {
    if (!isLoggedIn) {
      return `/login?return=/agora/write?board=${boardType}`
    }
    return `/agora/write?board=${boardType}`
  }

  // 권한 없을 때 메시지
  const getPermissionMessage = () => {
    switch (boardType) {
      case 'party':
        return '당원만 글을 작성할 수 있습니다'
      case 'innovation':
        return '혁신당원만 글을 작성할 수 있습니다'
      default:
        return '로그인이 필요합니다'
    }
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

  return (
    <div>
      {/* 상단 글쓰기 버튼 */}
      <div className="flex justify-end mb-4">
        {isLoggedIn && canWrite() ? (
          <Link
            href={getWriteUrl()}
            className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            ✏️ 글쓰기
          </Link>
        ) : isLoggedIn ? (
          <button
            disabled
            className="px-4 py-1.5 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed font-medium"
            title={getPermissionMessage()}
          >
            ✏️ {getPermissionMessage()}
          </button>
        ) : (
          <Link
            href={getWriteUrl()}
            className="px-4 py-1.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            ✏️ 글쓰기
          </Link>
        )}
      </div>

      {/* 게시글 목록 */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500 bg-white rounded-xl border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-lg">아직 게시글이 없습니다.</p>
          <p className="text-sm mt-2">첫 번째 글을 작성해보세요!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-16 hidden sm:table-cell">No.</th>
                <th className="px-6 py-1.5 text-left text-sm font-semibold text-gray-900">제목</th>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-28 hidden sm:table-cell">
                  {boardType === 'anonymous' ? 'IP' : '작성자'}
                </th>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-24">등록일</th>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-16 hidden md:table-cell">조회</th>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-16 hidden md:table-cell">👍</th>
                <th className="px-4 py-1.5 text-center text-sm font-semibold text-gray-900 w-16 hidden md:table-cell">👎</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {posts.map((post, index) => (
                <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-1.5 text-center text-sm text-gray-500 hidden sm:table-cell">
                    {pagination ? pagination.total - ((currentPage - 1) * 20) - index : index + 1}
                  </td>
                  <td className="px-6 py-1.5">
                    <Link 
                      href={`/agora/${post._id}`}
                      className="flex items-center gap-2 hover:text-primary transition-colors"
                    >
                      <span className="font-medium text-gray-900 line-clamp-1">
                        {post.title}
                      </span>
                      {post.commentCount > 0 && (
                        <span className="text-primary text-sm flex-shrink-0">[{post.commentCount}]</span>
                      )}
                    </Link>
                  </td>
                  <td className="px-4 py-1.5 text-center hidden sm:table-cell">
                    {boardType === 'anonymous' ? (
                      // 익명 게시판 - IP 표시
                      <span className="text-sm text-gray-500 font-mono">
                        {maskIp(post.authorIp || '')}
                      </span>
                    ) : post.author ? (
                      // 일반 게시판 - 닉네임 + 드롭다운
                      <MentionDropdown nickname={post.author.nickname}>
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
                      </MentionDropdown>
                    ) : (
                      <span className="text-sm text-gray-400">알 수 없음</span>
                    )}
                  </td>
                  <td className="px-4 py-1.5 text-center text-sm text-gray-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-4 py-1.5 text-center text-sm text-gray-500 hidden md:table-cell">
                    {post.viewCount}
                  </td>
                  <td className="px-4 py-1.5 text-center text-sm text-gray-500 hidden md:table-cell">
                    {post.likeCount}
                  </td>
                  <td className="px-4 py-1.5 text-center text-sm text-gray-500 hidden md:table-cell">
                    {post.dislikeCount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="px-4 py-1.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
