'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import FainPostCard from './FainPostCard'
import FainComposer from './FainComposer'

interface Post {
  _id: string
  author: {
    _id: string
    nickname: string
    profileImage?: string
    memberType?: string
  }
  content: string
  images?: string[]
  likeCount: number
  repostCount: number
  replyCount: number
  viewCount: number
  createdAt: string
  isLiked?: boolean
  isReposted?: boolean
  isBookmarked?: boolean
  isOwner?: boolean
  repostOf?: Post
}

type FeedType = 'latest' | 'following'

export default function FainFeed() {
  const { isLoggedIn } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [feedType, setFeedType] = useState<FeedType>('latest')
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ''

  const loadPosts = useCallback(async (pageNum: number, append: boolean = false) => {
    if (pageNum === 1) {
      setIsLoading(true)
    } else {
      setIsLoadingMore(true)
    }

    try {
      const token = localStorage.getItem('memberToken')
      const headers: Record<string, string> = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const res = await fetch(
        `${API_URL}/api/fain?page=${pageNum}&limit=20&type=${feedType}`,
        { headers }
      )
      const data = await res.json()

      if (data.success) {
        if (append) {
          setPosts(prev => [...prev, ...data.posts])
        } else {
          setPosts(data.posts)
        }
        setHasMore(data.pagination.page < data.pagination.totalPages)
      }
    } catch (error) {
      console.error('피드 로드 실패:', error)
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [API_URL, feedType])

  useEffect(() => {
    setPage(1)
    loadPosts(1)
  }, [feedType, loadPosts])

  const loadMore = () => {
    if (!isLoadingMore && hasMore) {
      const nextPage = page + 1
      setPage(nextPage)
      loadPosts(nextPage, true)
    }
  }

  const handleNewPost = (newPost: Post) => {
    setPosts(prev => [newPost, ...prev])
  }

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('memberToken')
      await fetch(`${API_URL}/api/fain/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('좋아요 실패:', error)
    }
  }

  const handleRepost = async (postId: string) => {
    try {
      const token = localStorage.getItem('memberToken')
      await fetch(`${API_URL}/api/fain/${postId}/repost`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('리포스트 실패:', error)
    }
  }

  const handleBookmark = async (postId: string) => {
    try {
      const token = localStorage.getItem('memberToken')
      await fetch(`${API_URL}/api/fain/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    } catch (error) {
      console.error('북마크 실패:', error)
    }
  }

  const handleDelete = async (postId: string) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const token = localStorage.getItem('memberToken')
      const res = await fetch(`${API_URL}/api/fain/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await res.json()
      if (data.success) {
        setPosts(prev => prev.filter(p => p._id !== postId))
      }
    } catch (error) {
      console.error('삭제 실패:', error)
    }
  }

  return (
    <div className="max-w-[600px] mx-auto border-x border-gray-200 min-h-screen">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <h1 className="px-4 py-3 text-xl font-bold">FAIN</h1>
        
        {/* 탭 */}
        <div className="flex">
          <button
            onClick={() => setFeedType('latest')}
            className={`flex-1 py-3 text-center font-medium transition-colors relative ${
              feedType === 'latest' ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            최신
            {feedType === 'latest' && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></div>
            )}
          </button>
          {isLoggedIn && (
            <button
              onClick={() => setFeedType('following')}
              className={`flex-1 py-3 text-center font-medium transition-colors relative ${
                feedType === 'following' ? 'text-gray-900' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              팔로잉
              {feedType === 'following' && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 글쓰기 */}
      <FainComposer onPost={handleNewPost} />

      {/* 피드 */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i className="fas fa-feather text-2xl text-gray-400"></i>
          </div>
          <p className="text-lg font-medium">아직 포스트가 없습니다</p>
          <p className="text-sm mt-2">첫 번째 포스트를 작성해보세요!</p>
        </div>
      ) : (
        <>
          {posts.map(post => (
            <FainPostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onRepost={handleRepost}
              onBookmark={handleBookmark}
              onDelete={handleDelete}
            />
          ))}

          {/* 더 불러오기 */}
          {hasMore && (
            <div className="py-4 text-center">
              <button
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-6 py-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
              >
                {isLoadingMore ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  '더 보기'
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
