'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'
import Cropper from 'react-easy-crop'

interface EventItem {
  _id: string
  title: string
  content: string
  excerpt: string
  category: string
  author: string
  eventDate: string
  endDate?: string
  eventLocation: string
  organizer: string
  contact?: string
  status: 'draft' | 'published'
  tags: string[]
  views: number
  attachments: Array<{
    filename: string
    originalName: string
    path: string
    url?: string
  }>
  createdAt: string
}

// 크롭 유틸리티
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const rotRad = (rotation * Math.PI) / 180
  const sin = Math.abs(Math.sin(rotRad))
  const cos = Math.abs(Math.cos(rotRad))
  const bBoxWidth = image.width * cos + image.height * sin
  const bBoxHeight = image.width * sin + image.height * cos

  canvas.width = bBoxWidth
  canvas.height = bBoxHeight

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2)
  ctx.rotate(rotRad)
  ctx.translate(-image.width / 2, -image.height / 2)
  ctx.drawImage(image, 0, 0)

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height)
  canvas.width = pixelCrop.width
  canvas.height = pixelCrop.height
  ctx.putImageData(data, 0, 0)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/jpeg', 0.9)
  })
}

export default function AdminEventsPage() {
  const { token } = useAuth()
  const [list, setList] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<EventItem | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // 드래그앤드롭
  const [isDragging, setIsDragging] = useState(false)

  // 크롭 상태
  const [showCropModal, setShowCropModal] = useState(false)
  const [currentCropIndex, setCurrentCropIndex] = useState(0)
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
  const [croppedBlobs, setCroppedBlobs] = useState<Blob[]>([])

  // 폼 상태
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '당 행사',
    author: '기획조정실',
    eventDate: new Date().toISOString().split('T')[0],
    endDate: '',
    eventLocation: '',
    organizer: '자유와혁신당',
    contact: '',
    status: 'published' as 'draft' | 'published',
    tags: ''
  })

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch(`/api/events?page=${currentPage}&limit=10&status=all`)
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

  // 파일 처리
  const processFiles = (files: File[]) => {
    if (files.length === 0) return

    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.')
      return
    }

    setSelectedFiles(imageFiles)
    setCroppedBlobs([])
    
    const url = URL.createObjectURL(imageFiles[0])
    setCropImage(url)
    setCurrentCropIndex(0)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setRotation(0)
    setShowCropModal(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    processFiles(files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    processFiles(files)
  }

  const onCropComplete = useCallback((_: any, cropped: any) => {
    setCroppedAreaPixels(cropped)
  }, [])

  const confirmCrop = async () => {
    if (!cropImage || !croppedAreaPixels) return

    const croppedBlob = await getCroppedImg(cropImage, croppedAreaPixels, rotation)
    if (!croppedBlob) {
      alert('이미지 처리에 실패했습니다')
      return
    }

    const newCroppedBlobs = [...croppedBlobs, croppedBlob]
    setCroppedBlobs(newCroppedBlobs)

    const nextIndex = currentCropIndex + 1
    if (nextIndex < selectedFiles.length) {
      const url = URL.createObjectURL(selectedFiles[nextIndex])
      setCropImage(url)
      setCurrentCropIndex(nextIndex)
      setCrop({ x: 0, y: 0 })
      setZoom(1)
      setRotation(0)
    } else {
      setShowCropModal(false)
      const urls = newCroppedBlobs.map(blob => URL.createObjectURL(blob))
      setPreviewUrls(urls)
    }
  }

  const cancelCrop = () => {
    setShowCropModal(false)
    setSelectedFiles([])
    setCroppedBlobs([])
    setPreviewUrls([])
    setCropImage(null)
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
      form.append('eventDate', formData.eventDate)
      if (formData.endDate) form.append('endDate', formData.endDate)
      form.append('eventLocation', formData.eventLocation)
      form.append('organizer', formData.organizer)
      if (formData.contact) form.append('contact', formData.contact)
      form.append('status', formData.status)
      if (formData.tags) form.append('tags', formData.tags)
      
      if (croppedBlobs.length > 0) {
        croppedBlobs.forEach((blob, index) => {
          form.append('attachments', blob, `event-${index}.jpg`)
        })
      }

      const url = editingItem 
        ? `/api/events/${editingItem._id}` 
        : '/api/events'
      
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      })

      if (res.ok) {
        fetchList()
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
      await fetch(`/api/events/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchList()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item: EventItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      category: item.category,
      author: item.author || '기획조정실',
      eventDate: item.eventDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      endDate: item.endDate?.split('T')[0] || '',
      eventLocation: item.eventLocation,
      organizer: item.organizer || '자유와혁신당',
      contact: item.contact || '',
      status: item.status,
      tags: item.tags?.join(', ') || ''
    })
    setSelectedFiles([])
    setCroppedBlobs([])
    setPreviewUrls([])
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingItem(null)
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: '당 행사',
      author: '기획조정실',
      eventDate: new Date().toISOString().split('T')[0],
      endDate: '',
      eventLocation: '',
      organizer: '자유와혁신당',
      contact: '',
      status: 'published',
      tags: ''
    })
    setSelectedFiles([])
    setCroppedBlobs([])
    setPreviewUrls([])
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
      case '당 행사': return 'bg-red-100 text-red-700'
      case '정책토론회': return 'bg-blue-100 text-blue-700'
      case '간담회': return 'bg-green-100 text-green-700'
      case '세미나': return 'bg-purple-100 text-purple-700'
      case '봉사활동': return 'bg-orange-100 text-orange-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const isUpcoming = (dateStr: string) => {
    return new Date(dateStr) >= new Date()
  }

  const categories = ['당 행사', '정책토론회', '간담회', '세미나', '봉사활동', '기타']

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">행사안내 관리</h1>
              <p className="text-gray-500 mt-1">총 {total}개의 행사</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 행사
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-calendar-alt text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">등록된 행사가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">제목</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">카테고리</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">일시</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">장소</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">D-Day</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">상태</th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {list.map((item) => {
                      const upcoming = isUpcoming(item.eventDate)
                      const daysUntil = Math.ceil((new Date(item.eventDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                      
                      return (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.excerpt}</div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(item.category)}`}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {formatDate(item.eventDate)}
                            {item.endDate && ` ~ ${formatDate(item.endDate)}`}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 truncate max-w-[150px]">
                            {item.eventLocation}
                          </td>
                          <td className="px-4 py-4">
                            {upcoming ? (
                              <span className={`px-2 py-1 text-xs rounded ${
                                daysUntil <= 7 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                              }`}>
                                D-{daysUntil}
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-500">
                                종료
                              </span>
                            )}
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
                      )
                    })}
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
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold">
                  {editingItem ? '행사 수정' : '새 행사'}
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
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">행사 시작일 *</label>
                    <input
                      type="date"
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">행사 종료일</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">장소 *</label>
                  <input
                    type="text"
                    value={formData.eventLocation}
                    onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="예: 국회의원회관 대회의실"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주최</label>
                    <input
                      type="text"
                      value={formData.organizer}
                      onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">연락처</label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="예: 02-1234-5678"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">요약 *</label>
                  <input
                    type="text"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="간단한 설명 (200자 이내)"
                    maxLength={200}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    rows={6}
                    required
                  />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">태그 (쉼표로 구분)</label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="예: 정책, 토론회, 경제"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    첨부 이미지 {editingItem ? '(새로 업로드하면 기존 이미지 대체)' : ''}
                  </label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragging 
                        ? 'border-primary bg-primary/5' 
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="event-images"
                    />
                    <label htmlFor="event-images" className="cursor-pointer">
                      <i className={`fas ${isDragging ? 'fa-download' : 'fa-cloud-upload-alt'} text-4xl ${isDragging ? 'text-primary' : 'text-gray-400'} mb-2`}></i>
                      <p className="text-gray-600">
                        {isDragging ? '여기에 놓으세요!' : '클릭하거나 이미지를 드래그하세요'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">16:9 비율로 크롭됩니다</p>
                    </label>
                  </div>
                  
                  {previewUrls.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">크롭된 이미지 ({previewUrls.length}장):</p>
                      <div className="grid grid-cols-4 gap-2">
                        {previewUrls.map((url, idx) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <img src={url} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {editingItem && editingItem.attachments && editingItem.attachments.length > 0 && previewUrls.length === 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">현재 이미지:</p>
                      <div className="grid grid-cols-4 gap-2">
                        {editingItem.attachments.map((att, idx) => (
                          <div key={idx} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
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

        {/* 크롭 모달 */}
        {showCropModal && cropImage && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60]">
            <div className="bg-white rounded-2xl w-full max-w-2xl m-4">
              <div className="p-4 border-b">
                <h3 className="text-lg font-bold">
                  이미지 편집 ({currentCropIndex + 1}/{selectedFiles.length})
                </h3>
                <p className="text-sm text-gray-500">16:9 비율로 크롭됩니다</p>
              </div>
              
              <div className="relative h-[400px] bg-gray-900">
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={16 / 9}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>

              <div className="p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-16">확대</span>
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12">{zoom.toFixed(1)}x</span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600 w-16">회전</span>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    step={1}
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500 w-12">{rotation}°</span>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={cancelCrop}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmCrop}
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    {currentCropIndex + 1 < selectedFiles.length ? '다음 이미지' : '완료'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
