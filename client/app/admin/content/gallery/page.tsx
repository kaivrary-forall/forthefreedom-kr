'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface GalleryItem {
  _id: string
  title: string
  content: string
  excerpt?: string
  category?: string
  author?: string
  status: 'draft' | 'published'
  views: number
  attachments: Array<{
    filename: string
    originalName: string
    path: string
    url?: string
  }>
  thumbnailUrl?: string
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export default function AdminGalleryPage() {
  const { token } = useAuth()
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '행사',
    author: '사무국',
    status: 'published' as 'draft' | 'published'
  })

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchGalleryList = useCallback(async () => {
    try {
      const res = await fetch(`/api/gallery?page=${currentPage}&limit=12&status=all`)
      const data = await res.json()
      if (data.success) {
        setGalleryList(data.data || [])
        setTotalPages(data.pagination?.pages || 1)
        setTotal(data.pagination?.total || 0)
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    fetchGalleryList()
  }, [fetchGalleryList])

  // 파일 선택 시 미리보기
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    setSelectedFiles(files)
    
    if (files) {
      const urls: string[] = []
      for (let i = 0; i < files.length; i++) {
        urls.push(URL.createObjectURL(files[i]))
      }
      setPreviewUrls(urls)
    } else {
      setPreviewUrls([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    setUploading(true)
    
    try {
      const form = new FormData()
      form.append('title', formData.title)
      form.append('content', formData.content)
      form.append('excerpt', formData.excerpt)
      form.append('category', formData.category)
      form.append('author', formData.author)
      form.append('status', formData.status)
      
      // 이미지 파일 추가
      if (selectedFiles) {
        for (let i = 0; i < selectedFiles.length; i++) {
          form.append('attachments', selectedFiles[i])
        }
      }

      const url = editingItem 
        ? `/api/gallery/${editingItem._id}` 
        : '/api/gallery'
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        body: form
      })

      if (res.ok) {
        fetchGalleryList()
        setShowModal(false)
        resetForm()
      } else {
        const error = await res.json()
        alert(error.message || '저장에 실패했습니다.')
      }
    } catch (error) {
      console.error('Failed to save gallery:', error)
      alert('저장 중 오류가 발생했습니다.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    try {
      await fetch(`/api/gallery/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchGalleryList()
    } catch (error) {
      console.error('Failed to delete gallery:', error)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt || '',
      category: item.category || '행사',
      author: item.author || '사무국',
      status: item.status
    })
    setSelectedFiles(null)
    setPreviewUrls([])
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '행사',
      author: '사무국',
      status: 'published'
    })
    setSelectedFiles(null)
    setPreviewUrls([])
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const categories = ['행사', '회의', '활동', '캠페인', '기타']

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">갤러리 관리</h1>
              <p className="text-gray-500 mt-1">총 {total}개의 갤러리</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 갤러리
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : galleryList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-images text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">등록된 갤러리가 없습니다.</p>
            </div>
          ) : (
            <>
              {/* 갤러리 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {galleryList.map((item) => (
                  <div key={item._id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                    {/* 썸네일 */}
                    <div className="relative aspect-video bg-gray-100">
                      {item.thumbnailUrl || item.imageUrl ? (
                        <img 
                          src={item.thumbnailUrl || item.imageUrl} 
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/images/placeholder.jpg'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <i className="fas fa-image text-4xl text-gray-300"></i>
                        </div>
                      )}
                      
                      {/* 상태 뱃지 */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.status === 'published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {item.status === 'published' ? '공개' : '비공개'}
                        </span>
                      </div>

                      {/* 이미지 개수 */}
                      {item.attachments && item.attachments.length > 1 && (
                        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-xs">
                          <i className="fas fa-images mr-1"></i>
                          {item.attachments.length}
                        </div>
                      )}

                      {/* 호버 액션 */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100"
                          title="수정"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 bg-white text-red-500 rounded-lg hover:bg-red-50"
                          title="삭제"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>

                    {/* 정보 */}
                    <div className="p-4">
                      <h3 className="font-bold text-gray-900 truncate mb-1">{item.title}</h3>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{item.category}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span><i className="fas fa-eye mr-1"></i>{item.views}</span>
                        <span><i className="fas fa-user mr-1"></i>{item.author}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 페이지네이션 */}
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
                  {editingItem ? '갤러리 수정' : '새 갤러리'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    제목 *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="갤러리 제목"
                    required
                  />
                </div>

                {/* 카테고리 & 상태 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상태
                    </label>
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

                {/* 작성자 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    작성자
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="작성자"
                  />
                </div>

                {/* 요약 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    요약
                  </label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="간단한 설명"
                  />
                </div>

                {/* 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={4}
                    placeholder="상세 내용"
                  />
                </div>

                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이미지 {editingItem ? '(새로 업로드하면 기존 이미지 대체)' : '*'}
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="gallery-images"
                    />
                    <label htmlFor="gallery-images" className="cursor-pointer">
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                      <p className="text-gray-600">클릭하여 이미지 선택</p>
                      <p className="text-sm text-gray-400 mt-1">여러 장 선택 가능 (최대 30장)</p>
                    </label>
                  </div>
                  
                  {/* 미리보기 */}
                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-4">
                      {previewUrls.map((url, idx) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 기존 이미지 (수정 시) */}
                  {editingItem && editingItem.attachments && editingItem.attachments.length > 0 && !previewUrls.length && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {editingItem.attachments.map((att, idx) => (
                          <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={att.url || att.path} 
                              alt={att.originalName} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 버튼 */}
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
                        업로드 중...
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
