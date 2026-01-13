'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface NoticeItem {
  _id: string
  title: string
  content: string
  excerpt: string
  category: '중요' | '일반' | '긴급'
  priority: number
  author: string
  isImportant: boolean
  tags: string[]
  status: 'draft' | 'published'
  views: number
  attachments: Array<{
    filename: string
    originalName: string
    path: string
    url?: string
  }>
  createdAt: string
}

export default function AdminNoticesPage() {
  const { token } = useAuth()
  const [list, setList] = useState<NoticeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<NoticeItem | null>(null)
  const [uploading, setUploading] = useState(false)

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '일반' as '중요' | '일반' | '긴급',
    priority: 0,
    author: '관리자',
    isImportant: false,
    status: 'published' as 'draft' | 'published',
    tags: ''
  })

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch(`/api/notices?page=${currentPage}&limit=10&status=all&sort=createdAt&order=desc`)
      const data = await res.json()
      if (data.success) {
        setList(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
        setTotal(data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchList()
  }, [fetchList])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setUploading(true)
    
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t) : []
      }

      const url = editingItem 
        ? `/api/notices/${editingItem._id}` 
        : '/api/notices'
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setCurrentPage(1)
        await fetchList()
        setShowModal(false)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.message || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      await fetch(`/api/notices/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchList()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item: NoticeItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      category: item.category,
      priority: item.priority || 0,
      author: item.author || '관리자',
      isImportant: item.isImportant || false,
      status: item.status,
      tags: item.tags?.join(', ') || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '일반',
      priority: 0,
      author: '관리자',
      isImportant: false,
      status: 'published',
      tags: ''
    })
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '긴급': return 'bg-red-100 text-red-700'
      case '중요': return 'bg-orange-100 text-orange-700'
      case '일반': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const categories = ['일반', '중요', '긴급']

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공지사항 관리</h1>
              <p className="text-gray-500 mt-1">총 {total}개의 공지사항</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 공지사항
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-bullhorn text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">제목</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">카테고리</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">작성자</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">조회수</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">작성일</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">상태</th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {list.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {item.isImportant && (
                              <i className="fas fa-thumbtack text-red-500"></i>
                            )}
                            <div>
                              <div className="font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                              <div className="text-sm text-gray-500 truncate max-w-xs">{item.excerpt}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">{item.author}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">{item.views}</td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatDate(item.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${
                            item.status === 'published' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {item.status === 'published' ? '공개' : '비공개'}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  >
                    이전
                  </button>
                  <span className="px-4 py-2 text-gray-600">
                    {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                  >
                    다음
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* 생성/수정 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold">
                  {editingItem ? '공지사항 수정' : '새 공지사항'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리 *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">상태</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'draft' | 'published' })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="published">공개</option>
                      <option value="draft">비공개</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">우선순위</label>
                    <input
                      type="number"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      min={0}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">요약</label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="간단한 설명 (500자 이내)"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={10}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="예: 당무, 선거, 정책"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isImportant"
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isImportant" className="text-sm text-gray-700">
                    중요 공지로 고정 (목록 상단에 표시)
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={uploading}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        저장 중...
                      </>
                    ) : (
                      editingItem ? '수정' : '등록'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
