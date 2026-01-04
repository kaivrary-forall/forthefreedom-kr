'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Post {
  _id: string
  title: string
  content: string
  author: {
    _id: string
    nickname: string
    userId?: string
    memberType?: string
  }
  boardType: string
  viewCount: number
  likeCount: number
  dislikeCount: number
  commentCount: number
  isDeleted: boolean
  deletedAt?: string
  createdAt: string
}

interface Comment {
  _id: string
  content: string
  author: {
    _id: string
    nickname: string
  }
  likeCount: number
  createdAt: string
}

export default function AgoraPostsAdminPage() {
  const { token } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // 필터
  const [boardType, setBoardType] = useState('member')
  const [keyword, setKeyword] = useState('')
  const [searchInput, setSearchInput] = useState('')
  
  // 상세 모달
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [postComments, setPostComments] = useState<Comment[]>([])
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // 게시글 목록 로드
  const loadPosts = useCallback(async (page = 1) => {
    if (!token) return
    
    try {
      setIsLoading(true)
      let url = `/api/admin/agora/posts?page=${page}&limit=20&boardType=${boardType}`
      if (keyword) url += `&keyword=${encodeURIComponent(keyword)}`

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setPosts(result.data.posts || [])
        if (result.data.pagination) {
          setPagination(result.data.pagination)
        }
      }
    } catch (error) {
      console.error('게시글 로드 실패:', error)
      setMessage({ type: 'error', text: '게시글 목록을 불러오는데 실패했습니다' })
    } finally {
      setIsLoading(false)
    }
  }, [token, boardType, keyword])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // 검색
  const handleSearch = () => {
    setKeyword(searchInput)
  }

  // 게시글 상세 보기
  const openDetail = async (post: Post) => {
    if (!token) return
    
    try {
      const response = await fetch(`/api/admin/agora/posts/${post._id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setSelectedPost(result.data.post)
        setPostComments(result.data.comments || [])
        setIsDetailOpen(true)
      }
    } catch (error) {
      console.error('게시글 상세 로드 실패:', error)
    }
  }

  // 게시글 삭제
  const handleDeletePost = async (id: string) => {
    if (!token || !confirm('이 게시글을 삭제하시겠습니까?\n(Soft Delete - 복구 가능)')) return
    
    try {
      const response = await fetch(`/api/admin/agora/posts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '게시글이 삭제되었습니다' })
        loadPosts(pagination.page)
        if (isDetailOpen) setIsDetailOpen(false)
      } else {
        setMessage({ type: 'error', text: result.message || '삭제에 실패했습니다' })
      }
    } catch (error) {
      console.error('게시글 삭제 실패:', error)
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' })
    }
  }

  // 게시글 복구
  const handleRestorePost = async (id: string) => {
    if (!token || !confirm('이 게시글을 복구하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/agora/posts/${id}/restore`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '게시글이 복구되었습니다' })
        loadPosts(pagination.page)
        if (isDetailOpen) setIsDetailOpen(false)
      } else {
        setMessage({ type: 'error', text: result.message || '복구에 실패했습니다' })
      }
    } catch (error) {
      console.error('게시글 복구 실패:', error)
      setMessage({ type: 'error', text: '복구 중 오류가 발생했습니다' })
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string, postId: string) => {
    if (!token || !confirm('이 댓글을 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/agora/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ postId })
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '댓글이 삭제되었습니다' })
        // 댓글 목록에서 제거
        setPostComments(prev => prev.filter(c => c._id !== commentId))
      } else {
        setMessage({ type: 'error', text: result.message || '삭제에 실패했습니다' })
      }
    } catch (error) {
      console.error('댓글 삭제 실패:', error)
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]*>/g, '').substring(0, 100)
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">아고라 게시글 관리</h1>
            <p className="text-gray-600 mt-1">게시글 조회 및 삭제 관리</p>
          </div>

          {/* 메시지 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* 필터/검색 */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="block text-sm text-gray-500 mb-1">게시판</label>
                <select
                  value={boardType}
                  onChange={(e) => setBoardType(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg"
                >
                  <option value="member">당원 게시판</option>
                  <option value="free">자유 게시판</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm text-gray-500 mb-1">검색</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="제목 또는 내용 검색"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-primary text-white rounded-lg"
                  >
                    검색
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">로딩 중...</div>
            ) : posts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">게시글이 없습니다</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성자</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">조회</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">👍/👎</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">💬</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {posts.map((post) => (
                    <tr key={post._id} className={`hover:bg-gray-50 ${post.isDeleted ? 'bg-red-50' : ''}`}>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openDetail(post)}
                          className="text-left hover:text-primary"
                        >
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {post.isDeleted && <span className="text-red-500">[삭제됨] </span>}
                            {post.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {stripHtml(post.content)}
                          </div>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {post.author?.nickname || '(알수없음)'}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{post.viewCount}</td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className="text-blue-600">{post.likeCount || 0}</span>
                        /
                        <span className="text-red-600">{post.dislikeCount || 0}</span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{post.commentCount || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(post.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openDetail(post)}
                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                          >
                            상세
                          </button>
                          {post.isDeleted ? (
                            <button
                              onClick={() => handleRestorePost(post._id)}
                              className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded"
                            >
                              복구
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeletePost(post._id)}
                              className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                              삭제
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {/* 페이지네이션 */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-200">
                {Array.from({ length: Math.min(pagination.totalPages, 10) }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => loadPosts(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.page === page
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 게시글 상세 모달 */}
      {isDetailOpen && selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">게시글 상세</h2>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="p-6">
              {/* 게시글 정보 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{selectedPost.title}</h3>
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
                  <span>작성자: {selectedPost.author?.nickname}</span>
                  <span>조회: {selectedPost.viewCount}</span>
                  <span>👍 {selectedPost.likeCount || 0} / 👎 {selectedPost.dislikeCount || 0}</span>
                  <span>{formatDate(selectedPost.createdAt)}</span>
                </div>
                <div 
                  className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                />
              </div>

              {/* 댓글 목록 */}
              <div>
                <h4 className="font-semibold mb-3">댓글 ({postComments.length})</h4>
                {postComments.length === 0 ? (
                  <p className="text-gray-500 text-sm">댓글이 없습니다</p>
                ) : (
                  <div className="space-y-3">
                    {postComments.map((comment) => (
                      <div key={comment._id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-medium text-sm">{comment.author?.nickname}</span>
                            <span className="text-xs text-gray-400 ml-2">{formatDate(comment.createdAt)}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteComment(comment._id, selectedPost._id)}
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            삭제
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              {selectedPost.isDeleted ? (
                <button
                  onClick={() => handleRestorePost(selectedPost._id)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  게시글 복구
                </button>
              ) : (
                <button
                  onClick={() => handleDeletePost(selectedPost._id)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  게시글 삭제
                </button>
              )}
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-6 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
