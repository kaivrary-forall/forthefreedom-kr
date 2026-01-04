'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Banner {
  _id: string
  title: string
  subtitle: string
  imageUrl: string
  mobileImageUrl?: string
  linkUrl: string
  linkText: string
  source: string
  sourceColor: 'white' | 'black' | 'gray'
  order: number
  isActive: boolean
  imageActive: boolean
  mobileImageActive?: boolean
  createdAt: string
  updatedAt: string
}

interface BannerSettings {
  randomOrder: boolean
  autoPlayInterval: number
}

const defaultBanner: Omit<Banner, '_id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  subtitle: '',
  imageUrl: '',
  mobileImageUrl: '',
  linkUrl: '',
  linkText: '자세히 보기',
  source: '',
  sourceColor: 'white',
  order: 0,
  isActive: true,
  imageActive: true,
  mobileImageActive: true
}

export default function BannersAdminPage() {
  const { token } = useAuth()
  const [banners, setBanners] = useState<Banner[]>([])
  const [settings, setSettings] = useState<BannerSettings>({ randomOrder: false, autoPlayInterval: 5000 })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  // 모달 상태
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [formData, setFormData] = useState(defaultBanner)
  const [pcImageFile, setPcImageFile] = useState<File | null>(null)
  const [mobileImageFile, setMobileImageFile] = useState<File | null>(null)

  // 데이터 로드
  const loadBanners = useCallback(async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/banners', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success) {
        setBanners(result.data || [])
      }
    } catch (error) {
      console.error('배너 로드 실패:', error)
      setMessage({ type: 'error', text: '배너 목록을 불러오는데 실패했습니다' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  const loadSettings = useCallback(async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/admin/banners/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('배너 설정 로드 실패:', error)
    }
  }, [token])

  useEffect(() => {
    loadBanners()
    loadSettings()
  }, [loadBanners, loadSettings])

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // 모달 열기
  const openCreateModal = () => {
    setEditingBanner(null)
    setFormData({ ...defaultBanner, order: banners.length })
    setPcImageFile(null)
    setMobileImageFile(null)
    setIsModalOpen(true)
  }

  const openEditModal = (banner: Banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle,
      imageUrl: banner.imageUrl,
      mobileImageUrl: banner.mobileImageUrl || '',
      linkUrl: banner.linkUrl,
      linkText: banner.linkText,
      source: banner.source,
      sourceColor: banner.sourceColor,
      order: banner.order,
      isActive: banner.isActive,
      imageActive: banner.imageActive,
      mobileImageActive: banner.mobileImageActive ?? true
    })
    setPcImageFile(null)
    setMobileImageFile(null)
    setIsModalOpen(true)
  }

  // 배너 저장
  const handleSave = async () => {
    if (!token) return
    
    // 유효성 검사: 새 배너인데 이미지 없음
    if (!editingBanner && !pcImageFile && !mobileImageFile) {
      setMessage({ type: 'error', text: 'PC용 또는 모바일용 이미지 중 하나는 필요합니다' })
      return
    }
    
    try {
      setIsSaving(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('subtitle', formData.subtitle || '')
      formDataToSend.append('linkUrl', formData.linkUrl || '')
      formDataToSend.append('linkText', formData.linkText || '자세히 보기')
      formDataToSend.append('source', formData.source || '')
      formDataToSend.append('sourceColor', formData.sourceColor)
      formDataToSend.append('order', String(formData.order))
      formDataToSend.append('isActive', String(formData.isActive))
      formDataToSend.append('imageActive', String(formData.imageActive))
      formDataToSend.append('mobileImageActive', String(formData.mobileImageActive))
      
      if (pcImageFile) {
        formDataToSend.append('image', pcImageFile)
      }
      if (mobileImageFile) {
        formDataToSend.append('mobileImage', mobileImageFile)
      }
      
      const url = editingBanner 
        ? `/api/admin/banners/${editingBanner._id}`
        : '/api/admin/banners'
      
      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: editingBanner ? '배너가 수정되었습니다' : '배너가 생성되었습니다' })
        setIsModalOpen(false)
        loadBanners()
      } else {
        setMessage({ type: 'error', text: result.message || '저장에 실패했습니다' })
      }
    } catch (error) {
      console.error('배너 저장 실패:', error)
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }

  // 배너 삭제
  const handleDelete = async (id: string) => {
    if (!token || !confirm('이 배너를 삭제하시겠습니까?')) return
    
    try {
      const response = await fetch(`/api/admin/banners/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '배너가 삭제되었습니다' })
        loadBanners()
      } else {
        setMessage({ type: 'error', text: result.message || '삭제에 실패했습니다' })
      }
    } catch (error) {
      console.error('배너 삭제 실패:', error)
      setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' })
    }
  }

  // 활성화 토글
  const handleToggleActive = async (banner: Banner) => {
    if (!token) return
    
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('isActive', String(!banner.isActive))
      
      const response = await fetch(`/api/admin/banners/${banner._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: banner.isActive ? '배너가 비활성화되었습니다' : '배너가 활성화되었습니다' })
        loadBanners()
      }
    } catch (error) {
      console.error('배너 상태 변경 실패:', error)
    }
  }

  // 순서 이동
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (!token) return
    
    const newBanners = [...banners]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    
    if (targetIndex < 0 || targetIndex >= newBanners.length) return
    
    // 순서 교환
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]]
    
    // order 값 재할당
    const orders = newBanners.map((b, i) => ({ id: b._id, order: i }))
    
    try {
      const response = await fetch('/api/admin/banners/reorder', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orders })
      })
      
      const result = await response.json()
      
      if (result.success) {
        loadBanners()
      }
    } catch (error) {
      console.error('순서 변경 실패:', error)
    }
  }

  // 설정 저장
  const handleSaveSettings = async () => {
    if (!token) return
    
    try {
      const response = await fetch('/api/admin/banners/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '설정이 저장되었습니다' })
      }
    } catch (error) {
      console.error('설정 저장 실패:', error)
      setMessage({ type: 'error', text: '설정 저장에 실패했습니다' })
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">배너 관리</h1>
              <p className="text-gray-600 mt-1">메인 페이지 슬라이더 배너를 관리합니다</p>
            </div>
            <button
              onClick={openCreateModal}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              + 배너 추가
            </button>
          </div>

          {/* 메시지 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* 설정 카드 */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">슬라이더 설정</h2>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={settings.randomOrder}
                  onChange={(e) => setSettings(prev => ({ ...prev, randomOrder: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-gray-700">랜덤 순서로 표시</span>
              </label>
              <button
                onClick={handleSaveSettings}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                설정 저장
              </button>
            </div>
          </div>

          {/* 배너 목록 */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">로딩 중...</div>
            ) : banners.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                등록된 배너가 없습니다
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">순서</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">미리보기</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">제목</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">링크</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">상태</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {banners.sort((a, b) => a.order - b.order).map((banner, index) => (
                    <tr key={banner._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMoveOrder(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▲
                          </button>
                          <span className="w-6 text-center text-sm text-gray-500">{banner.order + 1}</span>
                          <button
                            onClick={() => handleMoveOrder(index, 'down')}
                            disabled={index === banners.length - 1}
                            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          >
                            ▼
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {banner.imageUrl ? (
                          <img 
                            src={banner.imageUrl} 
                            alt={banner.title} 
                            className="w-24 h-14 object-cover rounded"
                          />
                        ) : (
                          <div className="w-24 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                            이미지 없음
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{banner.title || '(제목 없음)'}</div>
                        {banner.subtitle && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">{banner.subtitle}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {banner.linkUrl ? (
                          <a 
                            href={banner.linkUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline truncate block max-w-xs"
                          >
                            {banner.linkUrl}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleToggleActive(banner)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            banner.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {banner.isActive ? '활성' : '비활성'}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(banner)}
                            className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => handleDelete(banner._id)}
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
          </div>
        </main>
      </div>

      {/* 배너 편집 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingBanner ? '배너 수정' : '배너 추가'}
              </h2>
            </div>
            
            <div className="p-6 space-y-6">
              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="배너 제목"
                />
              </div>

              {/* 부제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부제목</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  placeholder="배너 부제목 (선택)"
                />
              </div>

              {/* PC 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">PC 이미지</label>
                {(formData.imageUrl || pcImageFile) && (
                  <div className="mb-2">
                    <img 
                      src={pcImageFile ? URL.createObjectURL(pcImageFile) : formData.imageUrl}
                      alt="PC 미리보기" 
                      className="w-full max-h-40 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPcImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              {/* 모바일 이미지 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">모바일 이미지 (선택)</label>
                {(formData.mobileImageUrl || mobileImageFile) && (
                  <div className="mb-2">
                    <img 
                      src={mobileImageFile ? URL.createObjectURL(mobileImageFile) : formData.mobileImageUrl}
                      alt="모바일 미리보기" 
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setMobileImageFile(e.target.files?.[0] || null)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg"
                />
              </div>

              {/* 링크 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">링크 URL</label>
                  <input
                    type="text"
                    value={formData.linkUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkUrl: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="/path 또는 https://"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">버튼 텍스트</label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkText: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="자세히 보기"
                  />
                </div>
              </div>

              {/* 출처 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">출처</label>
                  <input
                    type="text"
                    value={formData.source}
                    onChange={(e) => setFormData(prev => ({ ...prev, source: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    placeholder="이미지 출처 (선택)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">출처 색상</label>
                  <select
                    value={formData.sourceColor}
                    onChange={(e) => setFormData(prev => ({ ...prev, sourceColor: e.target.value as 'white' | 'black' | 'gray' }))}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  >
                    <option value="white">흰색</option>
                    <option value="black">검정</option>
                    <option value="gray">회색</option>
                  </select>
                </div>
              </div>

              {/* 활성화 */}
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-gray-700">배너 활성화</span>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                {isSaving ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  )
}
