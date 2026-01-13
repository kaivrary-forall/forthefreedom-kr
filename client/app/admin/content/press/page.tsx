'use client'
import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Spokesperson {
  _id: string
  title: string
  content: string
  excerpt: string
  category: string
  spokespersonName: string
  spokespersonTitle: string
  issueDate: string
  author: string
  isUrgent: boolean
  tags: string[]
  attachments: {
    filename: string
    originalName: string
    path: string
    size: number
    mimeType: string
  }[]
  status: 'draft' | 'published'
  views: number
  createdAt: string
  updatedAt: string
}

const defaultSpokesperson = {
  title: '',
  content: '',
  excerpt: '',
  category: '논평',
  spokespersonName: '당 대변인',
  spokespersonTitle: '대변인',
  author: '',
  isUrgent: false,
  tags: [] as string[],
  status: 'published' as 'draft' | 'published'
}

const categoryOptions = ['논평', '성명', '브리핑', '보도자료', '입장문']

export default function PressAdminPage() {
  const { token, member } = useAuth()
  const [items, setItems] = useState<Spokesperson[]>([])
  const [pagination, setPagination] = useState({ current: 1, pages: 1, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Spokesperson | null>(null)
  const [formData, setFormData] = useState(defaultSpokesperson)
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [tagInput, setTagInput] = useState('')

  // 데이터 로드
  const loadItems = useCallback(async (page = 1) => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/spokesperson?page=${page}&limit=20&status=all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success) {
        setItems(result.data || [])
        if (result.pagination) {
          setPagination(result.pagination)
        }
      }
    } catch (error) {
      console.error('보도자료 로드 실패:', error)
      setMessage({ type: 'error', text: '보도자료 목록을 불러오는데 실패했습니다' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadItems()
  }, [loadItems])

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  const openCreateModal = () => {
    setEditingItem(null)
    setFormData({ ...defaultSpokesperson, author: member?.nickname || '대변인실' })
    setAttachmentFiles([])
    setTagInput('')
    setIsModalOpen(true)
  }

  const openEditModal = (item: Spokesperson) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      category: item.category,
      spokespersonName: item.spokespersonName,
      spokespersonTitle: item.spokespersonTitle,
      author: item.author,
      isUrgent: item.isUrgent,
      tags: item.tags || [],
      status: item.status
    })
    setAttachmentFiles([])
    setTagInput('')
    setIsModalOpen(true)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }))
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const handleSave = async () => {
    if (!token) return
    
    if (!formData.title.trim()) {
      setMessage({ type: 'error', text: '제목을 입력해주세요' })
      return
    }
    if (!formData.content.trim()) {
      setMessage({ type: 'error', text: '내용을 입력해주세요' })
      return
    }
    
    try {
      setIsSaving(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('excerpt', formData.excerpt)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('spokespersonName', formData.spokespersonName)
      formDataToSend.append('spokespersonTitle', formData.spokespersonTitle)
      formDataToSend.append('author', formData.author)
      formDataToSend.append('isUrgent', String(formData.isUrgent))
      formDataToSend.append('tags', JSON.stringify(formData.tags))
      
      attachmentFiles.forEach(file => {
        formDataToSend.append('attachments', file)
      })
      
      const url = editingItem 
        ? `/api/admin/spokesperson/${editingItem._id}`
        : '/api/admin/spokesperson'
      
      const response = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: editingItem ? '보도자료가 수정되었습니다' : '보도자료가 생성되었습니다' })
        setIsModalOpen(false)
        loadItems(pagination.current)
      } else {
        setMessage({ type: 'error', text: result.message || '저장에 실패했습니다' })
      }
    } catch (error) {
      console.error('보도자료 저장 실패:', error)
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token || !confirm('이 보도자료를 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/spokesperson/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '보도자료가 삭제되었습니다' })
        loadItems(pagination.current)
      } else {
        setMessage({ type: 'error', text: result.message || '삭제에 실패했습니다' })
      }
    } catch (error) {
      console.error('보도자료 삭제 실패:', error)
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' })
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        
        <main className="flex-1 p-8 ml-64">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">보도자료 관리</h1>
              <p className="text-gray-600 mt-1">총 {pagination.total}개의 보도자료</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              + 보도자료 작성
            </button>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">로딩 중...</div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">등록된 보도자료가 없습니다</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">분류</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">대변인</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">조회</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">작성일</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {item.category}
                        </span>
                        {item.isUrgent && <span className="ml-1 text-red-500">🔥</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.spokespersonName}</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-500">{item.views}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(item.createdAt)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                          >
                            삭제
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 p-4 border-t border-gray-200">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => loadItems(page)}
                    className={`px-3 py-1 rounded ${
                      pagination.current === page
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? '보도자료 수정' : '보도자료 작성'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="보도자료 제목"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">분류</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">대변인 이름</label>
                  <input
                    type="text"
                    value={formData.spokespersonName}
                    onChange={(e) => setFormData(prev => ({ ...prev, spokespersonName: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">직책</label>
                  <input
                    type="text"
                    value={formData.spokespersonTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, spokespersonTitle: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isUrgent}
                    onChange={(e) => setFormData(prev => ({ ...prev, isUrgent: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">🔥 긴급</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">내용 *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg resize-none"
                  placeholder="보도자료 내용을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">요약</label>
                <input
                  type="text"
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                  placeholder="보도자료 요약 (선택)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">태그</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    placeholder="태그 입력 후 Enter"
                  />
                  <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-100 rounded-lg">추가</button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                        #{tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-600">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">첨부파일</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setAttachmentFiles(Array.from(e.target.files || []))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded-lg">취소</button>
              <button onClick={handleSave} disabled={isSaving} className="px-6 py-2 bg-primary text-white rounded-lg disabled:opacity-50">
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
