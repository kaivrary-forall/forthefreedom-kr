'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'
import Cropper from 'react-easy-crop'

interface MediaCoverageItem {
  _id: string
  title: string
  content: string
  excerpt: string
  mediaOutlet: string
  mediaType: 'TV' | '신문' | '온라인' | '라디오' | '잡지'
  journalist: string
  program: string
  broadcastDate: string
  broadcastTime: string
  category: string
  tone: string
  importance: string
  originalUrl: string
  author: string
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

export default function AdminMediaCoveragePage() {
  const { token } = useAuth()
  const [list, setList] = useState<MediaCoverageItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MediaCoverageItem | null>(null)
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
    mediaOutlet: '',
    mediaType: 'TV' as 'TV' | '신문' | '온라인' | '라디오' | '잡지',
    journalist: '',
    program: '',
    broadcastDate: new Date().toISOString().split('T')[0],
    broadcastTime: '',
    category: '뉴스',
    tone: '중립',
    importance: '중',
    originalUrl: '',
    author: '미디어팀',
    status: 'published' as 'draft' | 'published'
  })

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchList = useCallback(async () => {
    try {
      const res = await fetch(`/api/media-coverage?page=${currentPage}&limit=10&status=all`)
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
      form.append('mediaOutlet', formData.mediaOutlet)
      form.append('mediaType', formData.mediaType)
      form.append('journalist', formData.journalist)
      form.append('program', formData.program)
      form.append('broadcastDate', formData.broadcastDate)
      form.append('broadcastTime', formData.broadcastTime)
      form.append('category', formData.category)
      form.append('tone', formData.tone)
      form.append('importance', formData.importance)
      form.append('originalUrl', formData.originalUrl)
      form.append('author', formData.author)
      form.append('status', formData.status)
      
      if (croppedBlobs.length > 0) {
        croppedBlobs.forEach((blob, index) => {
          form.append('attachments', blob, `media-${index}.jpg`)
        })
      }

      const url = editingItem 
        ? `/api/media-coverage/${editingItem._id}` 
        : '/api/media-coverage'
      
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
      await fetch(`/api/media-coverage/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchList()
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const handleEdit = (item: MediaCoverageItem) => {
    setEditingItem(item)
    setFormData({
      title: item.title,
      content: item.content,
      excerpt: item.excerpt,
      mediaOutlet: item.mediaOutlet,
      mediaType: item.mediaType,
      journalist: item.journalist || '',
      program: item.program || '',
      broadcastDate: item.broadcastDate?.split('T')[0] || new Date().toISOString().split('T')[0],
      broadcastTime: item.broadcastTime || '',
      category: item.category,
      tone: item.tone || '중립',
      importance: item.importance || '중',
      originalUrl: item.originalUrl || '',
      author: item.author,
      status: item.status
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
      mediaOutlet: '',
      mediaType: 'TV',
      journalist: '',
      program: '',
      broadcastDate: new Date().toISOString().split('T')[0],
      broadcastTime: '',
      category: '뉴스',
      tone: '중립',
      importance: '중',
      originalUrl: '',
      author: '미디어팀',
      status: 'published'
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

  const getToneColor = (tone: string) => {
    switch (tone) {
      case '긍정': return 'bg-green-100 text-green-700'
      case '지지': return 'bg-blue-100 text-blue-700'
      case '중립': return 'bg-gray-100 text-gray-700'
      case '부정': return 'bg-orange-100 text-orange-700'
      case '비판': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getImportanceColor = (importance: string) => {
    switch (importance) {
      case '상': return 'bg-red-100 text-red-700'
      case '중': return 'bg-yellow-100 text-yellow-700'
      case '하': return 'bg-gray-100 text-gray-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const mediaTypes = ['TV', '신문', '온라인', '라디오', '잡지']
  const categories = ['뉴스', '토론', '인터뷰', '기획', '칼럼', '사설', '기타']
  const tones = ['긍정', '중립', '부정', '비판', '지지']
  const importances = ['상', '중', '하']

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">언론보도 관리</h1>
              <p className="text-gray-500 mt-1">총 {total}개의 언론보도</p>
            </div>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 언론보도
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : list.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-newspaper text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">등록된 언론보도가 없습니다.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">제목</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">매체</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">유형</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">논조</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">중요도</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">보도일</th>
                      <th className="px-4 py-4 text-left text-sm font-medium text-gray-500">상태</th>
                      <th className="px-4 py-4 text-center text-sm font-medium text-gray-500">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {list.map((item) => (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 truncate max-w-xs">{item.title}</div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">{item.excerpt}</div>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">{item.mediaOutlet}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                            {item.mediaType}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${getToneColor(item.tone)}`}>
                            {item.tone}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-1 text-xs rounded ${getImportanceColor(item.importance)}`}>
                            {item.importance}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {formatDate(item.broadcastDate)}
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
            <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b sticky top-0 bg-white z-10">
                <h2 className="text-xl font-bold">
                  {editingItem ? '언론보도 수정' : '새 언론보도'}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">매체명 *</label>
                    <input
                      type="text"
                      value={formData.mediaOutlet}
                      onChange={(e) => setFormData({ ...formData, mediaOutlet: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="예: KBS, 조선일보"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">매체 유형 *</label>
                    <select
                      value={formData.mediaType}
                      onChange={(e) => setFormData({ ...formData, mediaType: e.target.value as any })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {mediaTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">기자/진행자</label>
                    <input
                      type="text"
                      value={formData.journalist}
                      onChange={(e) => setFormData({ ...formData, journalist: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">프로그램/지면</label>
                    <input
                      type="text"
                      value={formData.program}
                      onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="예: 뉴스9, 정치부"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">보도일 *</label>
                    <input
                      type="date"
                      value={formData.broadcastDate}
                      onChange={(e) => setFormData({ ...formData, broadcastDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">보도시간</label>
                    <input
                      type="text"
                      value={formData.broadcastTime}
                      onChange={(e) => setFormData({ ...formData, broadcastTime: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="예: 21:00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
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
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">논조</label>
                    <select
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {tones.map(tone => (
                        <option key={tone} value={tone}>{tone}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">중요도</label>
                    <select
                      value={formData.importance}
                      onChange={(e) => setFormData({ ...formData, importance: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {importances.map(imp => (
                        <option key={imp} value={imp}>{imp}</option>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">원본 URL</label>
                  <input
                    type="url"
                    value={formData.originalUrl}
                    onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://..."
                  />
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
                      id="media-images"
                    />
                    <label htmlFor="media-images" className="cursor-pointer">
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
