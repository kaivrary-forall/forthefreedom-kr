'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

interface Author {
  _id: string
  nickname: string
  userId?: string
  memberType?: string
  profileImage?: string
}

interface Comment {
  _id: string
  post: string
  author: Author
  content: string
  parentComment?: string | null
  createdAt?: string
  updatedAt?: string
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
  isLiked?: boolean
  isDisliked?: boolean
  createdAt: string
  updatedAt: string
}

export default function AgoraDetailAPI() {
  const params = useParams()
  const id = params.id as string
  const { isLoggedIn, token } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // 댓글 작성
  const [commentContent, setCommentContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  // 좋아요/싫어요 상태
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [isVoting, setIsVoting] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const loadPost = async () => {
    if (!id) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }
      
      const response = await fetch(`/api/agora/${id}`, { headers })
      const data = await response.json()
      
      if (data.success && data.post) {
        setPost(data.post)
        setComments(data.comments || [])
        // 좋아요/싫어요 상태 초기화
        setLikeCount(data.post.likeCount || 0)
        setDislikeCount(data.post.dislikeCount || 0)
        setIsLiked(data.post.isLiked || false)
        setIsDisliked(data.post.isDisliked || false)
      } else {
        setError(data.error || '게시글을 찾을 수 없습니다.')
      }
    } catch (err) {
      console.error('게시글 로드 실패:', err)
      setError('게시글을 불러오는 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadPost()
  }, [id])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ko-KR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // 좋아요/싫어요 핸들러
  const handleVote = async (type: 'like' | 'dislike') => {
    if (!isLoggedIn || !token) {
      alert('로그인이 필요합니다')
      return
    }
    
    if (isVoting) return
    
    setIsVoting(true)
    
    try {
      const response = await fetch(`${API_URL}/api/posts/${id}/${type}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        // 서버에서 반환된 값으로 업데이트 (data.data 안에 있음)
        setLikeCount(data.data.likeCount)
        setDislikeCount(data.data.dislikeCount)
        setIsLiked(data.data.isLiked)
        setIsDisliked(data.data.isDisliked)
      } else {
        alert(data.message || '투표에 실패했습니다')
      }
    } catch (err) {
      console.error('투표 실패:', err)
      alert('투표 중 오류가 발생했습니다')
    } finally {
      setIsVoting(false)
    }
  }

  // 댓글 작성 핸들러
  const handleCommentSubmit = async () => {
    if (!commentContent.trim()) {
      setCommentError('댓글 내용을 입력해주세요')
      return
    }

    if (!token) {
      setCommentError('로그인이 필요합니다')
      return
    }

    setIsSubmitting(true)
    setCommentError(null)

    try {
      const response = await fetch(`/api/agora/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentContent.trim() })
      })

      const data = await response.json()

      if (data.success) {
        setCommentContent('')
        // 댓글 목록 새로고침
        await loadPost()
      } else {
        setCommentError(data.message || '댓글 작성에 실패했습니다')
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err)
      setCommentError('댓글 작성 중 오류가 발생했습니다')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">😕</span>
        </div>
        <p className="text-lg text-gray-500 mb-6">{error || '게시글을 찾을 수 없습니다.'}</p>
        <Link 
          href="/agora"
          className="inline-flex items-center gap-2 text-primary hover:text-primary-dark"
        >
          ← 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <header className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            {post.author.profileImage && (
              <img 
                src={post.author.profileImage} 
                alt={post.author.nickname}
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span className="font-medium text-gray-700">{post.author.nickname}</span>
          </div>
          <span>•</span>
          <span>{formatDate(post.createdAt)}</span>
          <span>•</span>
          <span>조회 {post.viewCount}</span>
        </div>
      </header>

      {/* 본문 */}
      <div className="p-6">
        <div 
          className="prose max-w-none text-gray-700"
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {post.content}
        </div>
      </div>

      {/* 좋아요/싫어요 */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-center gap-6">
        <button 
          onClick={() => handleVote('like')}
          disabled={isVoting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isLiked 
              ? 'border-primary bg-primary/10 text-primary' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>👍</span>
          <span>{likeCount}</span>
        </button>
        <button 
          onClick={() => handleVote('dislike')}
          disabled={isVoting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
            isDisliked 
              ? 'border-red-500 bg-red-50 text-red-500' 
              : 'border-gray-200 hover:bg-gray-50 text-gray-600'
          } ${isVoting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <span>👎</span>
          <span>{dislikeCount}</span>
        </button>
      </div>

      {/* 댓글 섹션 */}
      <section className="px-6 py-6 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            💬 댓글 <span className="text-gray-500 font-medium">({comments.length})</span>
          </h2>
        </div>

        {comments.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            댓글이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((c) => {
              const author = c.author?.nickname || c.author?.userId || '익명'
              const profileImage = c.author?.profileImage || ''
              const memberType = c.author?.memberType || ''
              const timeText = c.createdAt
                ? new Date(c.createdAt).toLocaleString('ko-KR', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''

              return (
                <div
                  key={c._id}
                  className="bg-white border border-gray-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                      {profileImage ? (
                        <img
                          src={profileImage}
                          alt={author}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <span className="text-gray-400 text-sm">👤</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">
                          {author}
                        </span>
                        {memberType && (
                          <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-xs rounded">
                            {memberType}
                          </span>
                        )}
                        {timeText && (
                          <span className="text-xs text-gray-400">{timeText}</span>
                        )}
                      </div>
                      <div className="mt-1 text-gray-700 whitespace-pre-line break-words">
                        {c.content || ''}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* 댓글 작성 */}
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl">
          {isLoggedIn ? (
            <>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                placeholder="댓글을 작성해주세요..."
                rows={3}
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                disabled={isSubmitting}
              />
              {commentError && (
                <p className="text-red-500 text-sm mt-2">{commentError}</p>
              )}
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting || !commentContent.trim()}
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </>
          ) : (
            <>
              <textarea
                className="w-full p-3 border border-gray-200 rounded-lg resize-none text-sm bg-gray-50"
                placeholder="댓글을 작성하려면 로그인이 필요합니다."
                rows={3}
                disabled
              />
              <div className="flex justify-between items-center mt-2">
                <Link href="/login" className="text-sm text-primary hover:underline">
                  로그인하기 →
                </Link>
                <button
                  className="px-4 py-2 bg-primary text-white text-sm rounded-lg opacity-50 cursor-not-allowed"
                  disabled
                >
                  댓글 작성
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 하단 네비게이션 */}
      <div className="px-6 py-4 border-t border-gray-100 flex justify-between">
        <Link 
          href="/agora"
          className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary transition-colors"
        >
          ← 목록으로
        </Link>
        {isLoggedIn ? (
          <Link 
            href="/agora/write"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            글쓰기
          </Link>
        ) : (
          <Link 
            href="/login?return=/agora/write"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            글쓰기
          </Link>
        )}
      </div>
    </article>
  )
}
