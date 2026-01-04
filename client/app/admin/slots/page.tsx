'use client'

import { useState, useEffect, useCallback } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface Member { _id: string; userId: string; nickname: string; name?: string; email?: string }
interface Permission { key: string; label: string; category: string }
interface AdminSlot { _id: string; slotId: string; slotName: string; description: string; permissions: string[]; canManageSlots: boolean; assignedMemberId: Member | null; assignedAt: string | null; assignedBy: string | null; note: string; isActive: boolean }

export default function SlotsAdminPage() {
  const { token } = useAuth()
  const [slots, setSlots] = useState<AdminSlot[]>([])
  const [allPermissions, setAllPermissions] = useState<Permission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<AdminSlot | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Member[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false)
  const [editingSlot, setEditingSlot] = useState<AdminSlot | null>(null)
  const [editPermissions, setEditPermissions] = useState<string[]>([])
  const [editSlotName, setEditSlotName] = useState('')
  const [editDescription, setEditDescription] = useState('')

  // 새 슬롯 추가 모달
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newSlotName, setNewSlotName] = useState('')
  const [newSlotDescription, setNewSlotDescription] = useState('')

  const loadSlots = useCallback(async () => {
    if (!token) return
    try {
      setIsLoading(true)
      const res = await fetch('/api/admin/slots', { headers: { 'Authorization': `Bearer ${token}` } })
      const result = await res.json()
      if (result.success) setSlots(result.data || [])
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '슬롯 목록을 불러오는데 실패했습니다' }) }
    finally { setIsLoading(false) }
  }, [token])

  const loadPermissions = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin/slots/permissions', { headers: { 'Authorization': `Bearer ${token}` } })
      const result = await res.json()
      if (result.success) setAllPermissions(result.data || [])
    } catch { console.error('권한 목록 로드 실패') }
  }, [token])

  useEffect(() => { loadSlots(); loadPermissions() }, [loadSlots, loadPermissions])
  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t) } }, [message])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 2 && token) {
        setIsSearching(true)
        fetch(`/api/admin/slots/search/members?q=${encodeURIComponent(searchQuery)}`, { headers: { 'Authorization': `Bearer ${token}` } })
          .then(r => r.json()).then(res => { if (res.success) setSearchResults(res.data || []) })
          .finally(() => setIsSearching(false))
      } else setSearchResults([])
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, token])

  const openAssignModal = (slot: AdminSlot) => { setSelectedSlot(slot); setSearchQuery(''); setSearchResults([]); setIsAssignModalOpen(true) }
  const openPermissionModal = (slot: AdminSlot) => { setEditingSlot(slot); setEditPermissions([...slot.permissions]); setEditSlotName(slot.slotName); setEditDescription(slot.description); setIsPermissionModalOpen(true) }
  const togglePermission = (key: string) => setEditPermissions(p => p.includes(key) ? p.filter(x => x !== key) : [...p, key])

  const savePermissions = async () => {
    if (!token || !editingSlot) return
    try {
      const res = await fetch(`/api/admin/slots/${editingSlot.slotId}/permissions`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: editPermissions, slotName: editSlotName, description: editDescription })
      })
      const result = await res.json()
      if (result.success) { setMessage({ type: 'success', text: result.message }); setIsPermissionModalOpen(false); loadSlots() }
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '권한 저장 중 오류가 발생했습니다' }) }
  }

  const assignMember = async (memberId: string) => {
    if (!token || !selectedSlot) return
    try {
      const res = await fetch(`/api/admin/slots/${selectedSlot.slotId}/assign`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId })
      })
      const result = await res.json()
      if (result.success) { setMessage({ type: 'success', text: result.message }); setIsAssignModalOpen(false); loadSlots() }
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '배정 중 오류가 발생했습니다' }) }
  }

  const unassignMember = async (slot: AdminSlot) => {
    if (!token || !confirm(`${slot.assignedMemberId?.nickname}님을 ${slot.slotName}에서 해제하시겠습니까?`)) return
    try {
      const res = await fetch(`/api/admin/slots/${slot.slotId}/unassign`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` } })
      const result = await res.json()
      if (result.success) { setMessage({ type: 'success', text: result.message }); loadSlots() }
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '해제 중 오류가 발생했습니다' }) }
  }

  // 새 슬롯 추가
  const createSlot = async () => {
    if (!token || !newSlotName.trim()) return
    try {
      const res = await fetch('/api/admin/slots/create', {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ slotName: newSlotName, description: newSlotDescription })
      })
      const result = await res.json()
      if (result.success) { setMessage({ type: 'success', text: result.message }); setIsCreateModalOpen(false); setNewSlotName(''); setNewSlotDescription(''); loadSlots() }
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '슬롯 추가 중 오류가 발생했습니다' }) }
  }

  // 슬롯 삭제
  const deleteSlot = async (slot: AdminSlot) => {
    if (!token || !confirm(`${slot.slotName}(${slot.slotId})을 삭제하시겠습니까?`)) return
    try {
      const res = await fetch(`/api/admin/slots/${slot.slotId}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
      const result = await res.json()
      if (result.success) { setMessage({ type: 'success', text: result.message }); loadSlots() }
      else setMessage({ type: 'error', text: result.message })
    } catch { setMessage({ type: 'error', text: '슬롯 삭제 중 오류가 발생했습니다' }) }
  }

  const permissionsByCategory = allPermissions.reduce((acc, p) => { if (!acc[p.category]) acc[p.category] = []; acc[p.category].push(p); return acc }, {} as Record<string, Permission[]>)
  const isDefaultSlot = (slotId: string) => ['admin_00', 'admin_01', 'admin_02', 'admin_03'].includes(slotId)

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">의자 배치 관리</h1>
              <p className="text-gray-600 mt-1">관리자 권한(의자)을 회원에게 배정하고 권한을 설정합니다</p>
            </div>
            <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2">
              <span>➕</span> 새 의자 추가
            </button>
          </div>

          {message && <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{message.text}</div>}

          {isLoading ? (
            <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
          ) : (
            <div className="grid gap-6">
              {slots.map((slot) => (
                <div key={slot._id} className={`bg-white rounded-xl shadow-sm border p-6 ${slot.canManageSlots ? 'border-red-200' : 'border-gray-200'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${slot.canManageSlots ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>{slot.slotId}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{slot.slotName}</h3>
                        {slot.canManageSlots && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded-full">👑 의자 배치 권한</span>}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{slot.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {slot.permissions.length === 0 && !slot.canManageSlots && <span className="text-gray-400 text-sm">권한 없음</span>}
                        {slot.permissions.map((perm, idx) => (
                          <span key={idx} className={`px-2 py-1 rounded text-xs font-medium ${perm === '*' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                            {perm === '*' ? '전체 권한' : allPermissions.find(p => p.key === perm)?.label || perm}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        {slot.assignedMemberId ? (
                          <>
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                              <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center"><span className="text-green-800 font-medium">{slot.assignedMemberId.nickname?.charAt(0) || '?'}</span></div>
                              <div><div className="font-medium text-green-900">{slot.assignedMemberId.nickname}</div><div className="text-xs text-green-700">@{slot.assignedMemberId.userId}</div></div>
                            </div>
                            {slot.assignedAt && <span className="text-xs text-gray-500">{new Date(slot.assignedAt).toLocaleDateString('ko-KR')} 배정</span>}
                          </>
                        ) : <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">비어있음</span>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      {!slot.canManageSlots && <button onClick={() => openPermissionModal(slot)} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-sm">권한 설정</button>}
                      {slot.assignedMemberId ? <button onClick={() => unassignMember(slot)} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm">해제</button>
                        : <button onClick={() => openAssignModal(slot)} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">배정</button>}
                      {!isDefaultSlot(slot.slotId) && !slot.assignedMemberId && (
                        <button onClick={() => deleteSlot(slot)} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 text-sm">삭제</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 배정 모달 */}
          {isAssignModalOpen && selectedSlot && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4">
                <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">회원 배정</h2><button onClick={() => setIsAssignModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button></div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg"><div className="font-medium text-blue-900">{selectedSlot.slotName}</div><div className="text-sm text-blue-700">{selectedSlot.slotId}</div></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">회원 검색</label><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="2글자 이상 입력" className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="max-h-64 overflow-y-auto">
                  {isSearching ? <div className="text-center py-4 text-gray-500">검색 중...</div>
                    : searchResults.length > 0 ? searchResults.map(m => (
                      <button key={m._id} onClick={() => assignMember(m._id)} className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-left mb-2">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"><span className="text-gray-600 font-medium">{m.nickname?.charAt(0)}</span></div>
                        <div className="flex-1"><div className="font-medium">{m.nickname}</div><div className="text-sm text-gray-500">@{m.userId}</div></div>
                        <span className="text-blue-500">선택</span>
                      </button>
                    )) : searchQuery.length >= 2 ? <div className="text-center py-4 text-gray-500">검색 결과가 없습니다</div> : <div className="text-center py-4 text-gray-400">2글자 이상 입력하세요</div>}
                </div>
                <div className="mt-4 flex justify-end"><button onClick={() => setIsAssignModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">취소</button></div>
              </div>
            </div>
          )}

          {/* 권한 수정 모달 */}
          {isPermissionModalOpen && editingSlot && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-lg p-6 mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">권한 설정</h2><button onClick={() => setIsPermissionModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button></div>
                <div className="mb-4 p-3 bg-purple-50 rounded-lg"><div className="font-medium text-purple-900">{editingSlot.slotId}</div></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">슬롯 이름</label><input type="text" value={editSlotName} onChange={(e) => setEditSlotName(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">설명</label><input type="text" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">권한 선택</label>
                  {Object.entries(permissionsByCategory).map(([cat, perms]) => (
                    <div key={cat} className="mb-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">{cat}</div>
                      <div className="space-y-2">
                        {perms.map(p => (
                          <label key={p.key} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input type="checkbox" checked={editPermissions.includes(p.key)} onChange={() => togglePermission(p.key)} className="w-5 h-5 text-purple-600 rounded" />
                            <div><div className="font-medium text-gray-900">{p.label}</div><div className="text-xs text-gray-500">{p.key}</div></div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsPermissionModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">취소</button>
                  <button onClick={savePermissions} className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">저장</button>
                </div>
              </div>
            </div>
          )}

          {/* 새 슬롯 추가 모달 */}
          {isCreateModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl w-full max-w-md p-6 mx-4">
                <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold">새 의자 추가</h2><button onClick={() => setIsCreateModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button></div>
                <div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-2">의자 이름 *</label><input type="text" value={newSlotName} onChange={(e) => setNewSlotName(e.target.value)} placeholder="예: 홍보 담당자" className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="mb-6"><label className="block text-sm font-medium text-gray-700 mb-2">설명</label><input type="text" value={newSlotDescription} onChange={(e) => setNewSlotDescription(e.target.value)} placeholder="예: SNS 및 홍보 콘텐츠 관리" className="w-full px-4 py-2 border rounded-lg" /></div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">취소</button>
                  <button onClick={createSlot} disabled={!newSlotName.trim()} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300">추가</button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </AdminGuard>
  )
}
