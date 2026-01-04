'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Congratulation {
  _id: string
  type: string
  title: string
  content: string
  targetName: string
  eventDate: string
  location?: string
  isActive: boolean
  createdAt: string
}

const TYPES = ['결혼', '출산', '돌잔치', '회갑', '칠순', '조의', '기타']

export default function CongratulationsAdminPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<Congratulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Congratulation | null>(null)
  const [form, setForm] = useState({ type: '결혼', title: '', content: '', targetName: '', eventDate: '', location: '' })

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/congratulations')
      const result = await res.json()
      if (result.success) setItems(result.data || [])
    } catch { setMessage({ type: 'error', text: '목록을 불러오는데 실패했습니다' }) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadItems() }, [loadItems])
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t) } }, [message])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({ type: '결혼', title: '', content: '', targetName: '', eventDate: new Date().toISOString().split('T')[0], location: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (item: Congratulation) => {
    setEditingItem(item)
    setForm({
      type: item.type,
      title: item.title,
      content: item.content,
      targetName: item.targetName,
      eventDate: new Date(item.eventDate).toISOString().split('T')[0],
      location: item.location || ''
    })
    setIsModalOpen(true)
  }

  const saveItem = async () => {
    if (!token || !form.title || !form.content || !form.targetName || !form.eventDate) {
      setMessage({ type: 'error', text: '필수 항목을 입력해주세요' })
      return
    }

    try {
      const url = editingItem ? `/api/congratulations/${editingItem._id}` : '/api/congratulations'
      const method = editingItem ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setIsModalOpen(false)
        loadItems()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch { setMessage({ type: 'error', text: '저장 중 오류가 발생했습니다' }) }
  }

  const deleteItem = async (id: string) => {
    if (!token || !confirm('정말 삭제하시겠습니까?')) return
    
    try {
      const res = await fetch(`/api/congratulations/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        loadItems()
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch { setMessage({ type: 'error', text: '삭제 중 오류가 발생했습니다' }) }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('ko-KR')
  
  const getTypeEmoji = (type: string) => {
    switch(type) {
      case '결혼': return '💒'
      case '출산': return '👶'
      case '돌잔치': return '🎂'
      case '회갑': return '🎊'
      case '칠순': return '🎉'
      case '조의': return '🕯️'
      default: return '📢'
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">경조사 관리</h1>
              <p className="text-gray-600 mt-1">당원 경조사 소식을 관리합니다</p>
            </div>
            <button onClick={openCreateModal} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              + 새 경조사
            </button>
          </div>

          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-500">등록된 경조사가 없습니다</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">대상자</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">행사일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">장소</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.type === '조의' ? 'bg-gray-100 text-gray-800' : 'bg-pink-100 text-pink-800'
                        }`}>{getTypeEmoji(item.type)} {item.type}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.targetName}</td>
                      <td className="px-6 py-4 text-gray-700">{item.title}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(item.eventDate)}</td>
                      <td className="px-6 py-4 text-gray-500">{item.location || '-'}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-800">수정</button>
                        <button onClick={() => deleteItem(item._id)} className="text-red-600 hover:text-red-800">삭제</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 모달 */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{editingItem ? '경조사 수정' : '새 경조사'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">유형 *</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                      {TYPES.map(t => <option key={t} value={t}>{getTypeEmoji(t)} {t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">대상자 *</label>
                    <input type="text" value={form.targetName} onChange={(e) => setForm({ ...form, targetName: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="예: 홍길동" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="예: 홍길동 당원 결혼" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">행사일 *</label>
                    <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">장소</label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="예: 서울 강남구 00웨딩홀" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                    <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="w-full px-4 py-2 border rounded-lg" placeholder="경조사 상세 내용을 입력하세요" />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">취소</button>
                  <button onClick={saveItem} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">저장</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
