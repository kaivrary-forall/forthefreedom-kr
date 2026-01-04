'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface SideCardSettings {
  displayMode: 'latest' | 'pinned' | 'random' | 'mixed'
  cardCount: number
  pinnedItems: {
    contentType: string
    contentId: string
    order: number
  }[]
  showCategories: {
    notice: boolean
    press: boolean
    event: boolean
    activity: boolean
    media: boolean
    personnel: boolean
    congratulations: boolean
  }
}

const defaultSettings: SideCardSettings = {
  displayMode: 'latest',
  cardCount: 4,
  pinnedItems: [],
  showCategories: {
    notice: true,
    press: true,
    event: true,
    activity: false,
    media: false,
    personnel: true,
    congratulations: true
  }
}

const displayModeLabels: Record<string, string> = {
  latest: '최신순',
  pinned: '고정 항목만',
  random: '랜덤',
  mixed: '고정 + 최신'
}

const categoryLabels: Record<string, string> = {
  notice: '공지사항',
  press: '보도자료',
  event: '일정',
  activity: '활동',
  media: '언론보도',
  personnel: '인사공고',
  congratulations: '경조사'
}

export default function SideCardsAdminPage() {
  const { token } = useAuth()
  const [settings, setSettings] = useState<SideCardSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 데이터 로드
  const loadSettings = useCallback(async () => {
    if (!token) return
    
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/side-cards/settings', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('설정 로드 실패:', error)
      setMessage({ type: 'error', text: '설정을 불러오는데 실패했습니다' })
    } finally {
      setIsLoading(false)
    }
  }, [token])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // 메시지 자동 숨김
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [message])

  // 설정 저장
  const handleSave = async () => {
    if (!token) return
    
    try {
      setIsSaving(true)
      
      const response = await fetch('/api/admin/side-cards/settings', {
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
      } else {
        setMessage({ type: 'error', text: result.message || '저장에 실패했습니다' })
      }
    } catch (error) {
      console.error('설정 저장 실패:', error)
      setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' })
    } finally {
      setIsSaving(false)
    }
  }

  // 카테고리 토글
  const toggleCategory = (category: keyof typeof settings.showCategories) => {
    setSettings(prev => ({
      ...prev,
      showCategories: {
        ...prev.showCategories,
        [category]: !prev.showCategories[category]
      }
    }))
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          {/* 헤더 */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">사이드카드 설정</h1>
            <p className="text-gray-600 mt-1">메인 페이지 사이드 영역에 표시할 콘텐츠를 설정합니다</p>
          </div>

          {/* 메시지 */}
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {isLoading ? (
            <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
              로딩 중...
            </div>
          ) : (
            <div className="space-y-6">
              {/* 표시 모드 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">표시 모드</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(displayModeLabels).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setSettings(prev => ({ ...prev, displayMode: value as SideCardSettings['displayMode'] }))}
                      className={`px-4 py-3 rounded-lg border-2 transition-colors ${
                        settings.displayMode === value
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-sm text-gray-500">
                  {settings.displayMode === 'latest' && '가장 최신 콘텐츠를 자동으로 표시합니다'}
                  {settings.displayMode === 'pinned' && '관리자가 고정한 항목만 표시합니다'}
                  {settings.displayMode === 'random' && '랜덤하게 콘텐츠를 표시합니다'}
                  {settings.displayMode === 'mixed' && '고정 항목 + 나머지는 최신 콘텐츠로 채웁니다'}
                </p>
              </div>

              {/* 카드 개수 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">표시 개수</h2>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="6"
                    value={settings.cardCount}
                    onChange={(e) => setSettings(prev => ({ ...prev, cardCount: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold text-primary w-12 text-center">{settings.cardCount}</span>
                </div>
                <p className="mt-2 text-sm text-gray-500">사이드 영역에 표시할 카드 개수 (1~6개)</p>
              </div>

              {/* 카테고리 표시 설정 */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">카테고리 표시</h2>
                <p className="text-sm text-gray-500 mb-4">표시할 콘텐츠 유형을 선택하세요 (최신순, 랜덤, 혼합 모드에서 적용)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <label
                      key={key}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors ${
                        settings.showCategories[key as keyof typeof settings.showCategories]
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={settings.showCategories[key as keyof typeof settings.showCategories]}
                        onChange={() => toggleCategory(key as keyof typeof settings.showCategories)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 고정 항목 안내 */}
              {(settings.displayMode === 'pinned' || settings.displayMode === 'mixed') && (
                <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
                  <h2 className="text-lg font-semibold text-yellow-800 mb-2">📌 고정 항목 설정</h2>
                  <p className="text-yellow-700">
                    고정 항목은 각 콘텐츠(공지사항, 보도자료 등) 관리 페이지에서 개별적으로 설정할 수 있습니다.
                    해당 콘텐츠의 &quot;사이드카드 고정&quot; 옵션을 활성화하세요.
                  </p>
                </div>
              )}

              {/* 저장 버튼 */}
              <div className="flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
