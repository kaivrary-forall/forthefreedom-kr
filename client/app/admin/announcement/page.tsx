'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Announcement {
  _id: string
  text: string
  link?: string
  linkText?: string
  bgColor: string
  textColor: string
  isActive: boolean
  hideHours?: number
  forceShowVersion?: number
  createdAt: string
}

const COLOR_PRESETS = [
  { name: '기본(검정)', bgColor: '#000000', textColor: '#ffffff' },
  { name: '강조(빨강)', bgColor: '#dc2626', textColor: '#ffffff' },
  { name: '경고(노랑)', bgColor: '#f59e0b', textColor: '#000000' },
  { name: '정보(파랑)', bgColor: '#2563eb', textColor: '#ffffff' },
  { name: '성공(초록)', bgColor: '#16a34a', textColor: '#ffffff' },
  { name: '브랜드', bgColor: '#8B1538', textColor: '#ffffff' },
]

const HIDE_HOURS_PRESETS = [
  { label: '3시간', value: 3 },
  { label: '6시간', value: 6 },
  { label: '12시간', value: 12 },
  { label: '24시간', value: 24 },
]

export default function AnnouncementAdminPage() {
  const { token } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [form, setForm] = useState({
    text: '',
    link: '',
    linkText: '자세히 보기',
    bgColor: '#000000',
    textColor: '#ffffff',
    isActive: true,
    hideHours: 6,
    forceShowVersion: 1
  })

  const loadAnnouncements = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/announcement/all')
      const result = await res.json()
      if (result.success) setAnnouncements(result.data || [])
    } catch { setMessage({ type: 'error', text: '목록을 불러오는데 실패했습니다' }) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadAnnouncements() }, [loadAnnouncements])
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t) } }, [message])

  const applyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setForm({ ...form, bgColor: preset.bgColor, textColor: preset.textColor })
  }

  const saveAnnouncement = async () => {
    if (!token || !form.text.trim()) {
      setMessage({ type: 'error', text: '공지 내용을 입력해주세요' })
      return
    }
    if (form.text.length > 100) {
      setMessage({ type: 'error', text: '100자 이내로 작성해주세요' })
      return
    }

    try {
      const res = await fetch('/api/announcement', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '공지가 등록되었습니다' })
        setForm({ text: '', link: '', linkText: '자세히 보기', bgColor: '#000000', textColor: '#ffffff', isActive: true, hideHours: 6, forceShowVersion: 1 })
        loadAnnouncements()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch { setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' }) }
  }

  const deleteAnnouncement = async (id: string) => {
    if (!token || !confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const res = await fetch(`/api/announcement/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '공지가 삭제되었습니다' })
        loadAnnouncements()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch { setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' }) }
  }

  const forceShow = async (announcement: Announcement) => {
    if (!token || !confirm('모든 사용자에게 이 공지를 다시 표시합니다. 계속하시겠습니까?')) return
    
    try {
      const res = await fetch(`/api/announcement/${announcement._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          forceShowVersion: (announcement.forceShowVersion || 1) + 1
        })
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '모든 사용자에게 공지가 다시 표시됩니다' })
        loadAnnouncements()
      }
    } catch { setMessage({ type: 'error', text: '오류가 발생했습니다' }) }
  }

  const updateHideHours = async (announcement: Announcement, hideHours: number) => {
    if (!token) return
    
    try {
      const res = await fetch(`/api/announcement/${announcement._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ hideHours })
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '설정이 저장되었습니다' })
        loadAnnouncements()
      }
    } catch { setMessage({ type: 'error', text: '오류가 발생했습니다' }) }
  }

  const activeAnnouncement = announcements.find(a => a.isActive)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">한줄 공지 관리</h1>
            <p className="text-gray-600 mt-1">상단에 표시되는 띠 형태의 공지를 관리합니다</p>
          </div>

          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

          {/* 현재 활성 공지 */}
          {activeAnnouncement && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">현재 활성 공지</h2>
                <button onClick={() => forceShow(activeAnnouncement)} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  🔄 강제 표시
                </button>
              </div>
              <div 
                className="py-2 px-4 text-center text-sm rounded-lg mb-4"
                style={{ backgroundColor: activeAnnouncement.bgColor, color: activeAnnouncement.textColor }}
              >
                {activeAnnouncement.text}
                {activeAnnouncement.link && <span className="ml-2 underline">{activeAnnouncement.linkText}</span>}
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">닫기 후 다시 표시 간격</label>
                <div className="flex gap-2">
                  {HIDE_HOURS_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => updateHideHours(activeAnnouncement, preset.value)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${(activeAnnouncement.hideHours || 6) === preset.value ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">현재: {activeAnnouncement.hideHours || 6}시간 후 다시 표시</p>
              </div>
            </div>
          )}

          {/* 미리보기 */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">미리보기</h2>
            <div 
              className="py-2 px-4 text-center text-sm rounded-lg"
              style={{ backgroundColor: form.bgColor, color: form.textColor }}
            >
              {form.text || '공지 내용을 입력하세요'}
              {form.link && <span className="ml-2 underline">{form.linkText || '자세히 보기'}</span>}
            </div>
          </div>

          {/* 입력 폼 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">새 공지 등록</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">공지 내용 * (100자 이내)</label>
                <input 
                  type="text" 
                  value={form.text} 
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  maxLength={100}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="예: 12월 27일 정기 집회가 있습니다"
                />
                <p className="text-xs text-gray-500 mt-1">{form.text.length}/100자</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">링크 URL (선택)</label>
                  <input 
                    type="text" 
                    value={form.link} 
                    onChange={(e) => setForm({ ...form, link: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="/news/notices"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">링크 텍스트</label>
                  <input 
                    type="text" 
                    value={form.linkText} 
                    onChange={(e) => setForm({ ...form, linkText: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="자세히 보기"
                  />
                </div>
              </div>

              {/* 숨김 시간 */}
              <div className="p-4 bg-blue-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">닫기 후 다시 표시 간격</label>
                <div className="flex gap-2">
                  {HIDE_HOURS_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setForm({ ...form, hideHours: preset.value })}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${form.hideHours === preset.value ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 색상 프리셋 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">색상 프리셋</label>
                <div className="flex flex-wrap gap-2">
                  {COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset)}
                      className="px-3 py-2 rounded-lg text-sm border hover:ring-2 ring-primary/30 transition"
                      style={{ backgroundColor: preset.bgColor, color: preset.textColor }}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                <label htmlFor="isActive" className="text-sm">바로 활성화 (기존 공지는 비활성화됩니다)</label>
              </div>

              <button onClick={saveAnnouncement} className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">
                공지 등록
              </button>
            </div>
          </div>

          {/* 공지 히스토리 */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">공지 히스토리</h2>
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">로딩 중...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-8 text-gray-500">등록된 공지가 없습니다</div>
            ) : (
              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann._id} className={`p-4 rounded-lg border ${ann.isActive ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {ann.isActive && <span className="px-2 py-0.5 bg-primary text-white text-xs rounded">활성</span>}
                        <span className="text-sm">{ann.text}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{new Date(ann.createdAt).toLocaleDateString()}</span>
                        <button onClick={() => deleteAnnouncement(ann._id)} className="text-red-500 hover:text-red-700 text-sm">삭제</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
