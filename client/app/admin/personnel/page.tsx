'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Personnel {
  _id: string
  type: string
  title: string
  content: string
  effectiveDate: string
  isActive: boolean
  createdAt: string
}

const TYPES = ['임명', '전보', '퇴임', '승진', '기타']

export default function PersonnelAdminPage() {
  const { token } = useAuth()
  const [items, setItems] = useState<Personnel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Personnel | null>(null)
  const [form, setForm] = useState({ type: '임명', title: '', content: '', effectiveDate: '' })

  const loadItems = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/personnel')
      const result = await res.json()
      if (result.success) setItems(result.data || [])
    } catch { setMessage({ type: 'error', text: '목록을 불러오는데 실패했습니다' }) }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { loadItems() }, [loadItems])
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t) } }, [message])

  const openCreateModal = () => {
    setEditingItem(null)
    setForm({ type: '임명', title: '', content: '', effectiveDate: new Date().toISOString().split('T')[0] })
    setIsModalOpen(true)
  }

  const openEditModal = (item: Personnel) => {
    setEditingItem(item)
    setForm({
      type: item.type,
      title: item.title,
      content: item.content,
      effectiveDate: new Date(item.effectiveDate).toISOString().split('T')[0]
    })
    setIsModalOpen(true)
  }

  const saveItem = async () => {
    if (!token || !form.title || !form.content || !form.effectiveDate) {
      setMessage({ type: 'error', text: '필수 항목을 입력해주세요' })
      return
    }

    try {
      const url = editingItem ? `/api/personnel/${editingItem._id}` : '/api/personnel'
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
      const res = await fetch(`/api/personnel/${id}`, {
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

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">인사공고 관리</h1>
              <p className="text-gray-600 mt-1">당직자 임명 및 인사발령 소식을 관리합니다</p>
            </div>
            <button onClick={openCreateModal} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
              + 새 인사공고
            </button>
          </div>

          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : items.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <p className="text-gray-500">등록된 인사공고가 없습니다</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">유형</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시행일</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">등록일</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.type === '임명' ? 'bg-blue-100 text-blue-800' :
                          item.type === '전보' ? 'bg-yellow-100 text-yellow-800' :
                          item.type === '퇴임' ? 'bg-gray-100 text-gray-800' :
                          item.type === '승진' ? 'bg-green-100 text-green-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>{item.type}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.title}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(item.effectiveDate)}</td>
                      <td className="px-6 py-4 text-gray-500">{formatDate(item.createdAt)}</td>
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
                  <h2 className="text-xl font-bold">{editingItem ? '인사공고 수정' : '새 인사공고'}</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">유형 *</label>
                    <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 border rounded-lg">
                      {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">제목 *</label>
                    <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg" placeholder="예: 홍길동 사무총장 임명" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">시행일 *</label>
                    <input type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">내용 *</label>
                    <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={5} className="w-full px-4 py-2 border rounded-lg" placeholder="인사공고 내용을 입력하세요" />
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
