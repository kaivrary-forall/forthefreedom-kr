'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'
import QRCode from 'qrcode'

interface QRItem {
  _id: string
  code: string
  name: string
  type: 'url' | 'vcard' | 'landing'
  targetUrl?: string
  landingSlug?: string
  vcardData?: {
    name?: string
    organization?: string
    title?: string
    phone?: string
    email?: string
    website?: string
    address?: string
    note?: string
  }
  scans: number
  isActive: boolean
  createdAt: string
}

interface VCardData {
  name: string
  organization: string
  title: string
  phone: string
  email: string
  website: string
  address: string
  note: string
}

export default function AdminQRPage() {
  const { token } = useAuth()
  const [qrList, setQrList] = useState<QRItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingQR, setEditingQR] = useState<QRItem | null>(null)
  const [qrImages, setQrImages] = useState<Record<string, string>>({})

  // 폼 상태
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    type: 'url' as 'url' | 'vcard' | 'landing',
    targetUrl: '',
    landingSlug: '',
    vcardData: {
      name: '',
      organization: '',
      title: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      note: ''
    },
    isActive: true
  })

  const fetchQRList = useCallback(async () => {
    if (!token) return
    
    try {
      const res = await fetch('/api/admin/qr', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.qrcodes) {
        setQrList(data.qrcodes)
        // QR 이미지 생성
        const images: Record<string, string> = {}
        for (const qr of data.qrcodes) {
          const url = `${window.location.origin}/qr/${qr.code}`
          images[qr._id] = await QRCode.toDataURL(url, { width: 150, margin: 1 })
        }
        setQrImages(images)
      }
    } catch (error) {
      console.error('Failed to fetch QR list:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchQRList()
  }, [fetchQRList])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    try {
      const url = editingQR 
        ? `/api/admin/qr/${editingQR._id}` 
        : '/api/admin/qr'
      
      const res = await fetch(url, {
        method: editingQR ? 'PUT' : 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        fetchQRList()
        setShowModal(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save QR:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/admin/qr/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchQRList()
    } catch (error) {
      console.error('Failed to delete QR:', error)
    }
  }

  const handleEdit = (qr: QRItem) => {
    setEditingQR(qr)
    setFormData({
      code: qr.code,
      name: qr.name,
      type: qr.type,
      targetUrl: qr.targetUrl || '',
      landingSlug: qr.landingSlug || '',
      vcardData: {
        name: qr.vcardData?.name || '',
        organization: qr.vcardData?.organization || '',
        title: qr.vcardData?.title || '',
        phone: qr.vcardData?.phone || '',
        email: qr.vcardData?.email || '',
        website: qr.vcardData?.website || '',
        address: qr.vcardData?.address || '',
        note: qr.vcardData?.note || ''
      },
      isActive: qr.isActive
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingQR(null)
    setFormData({
      code: '',
      name: '',
      type: 'url',
      targetUrl: '',
      landingSlug: '',
      vcardData: {
        name: '', organization: '', title: '', phone: '', email: '', website: '', address: '', note: ''
      },
      isActive: true
    })
  }

  const downloadQR = async (qr: QRItem) => {
  const url = `${window.location.origin}/qr/${qr.code}`
  const dataUrl = await QRCode.toDataURL(url, { 
    width: 1024,           // 고화질
    margin: 1,
    color: {
      dark: '#000000',     // QR 코드 색상 (검정)
      light: '#00000000'   // 배경 투명
    }
  })
  
  const link = document.createElement('a')
  link.download = `qr-${qr.code}.png`
  link.href = dataUrl
  link.click()
}

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">QR 코드 관리</h1>
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 QR 코드
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : qrList.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-qrcode text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">등록된 QR 코드가 없습니다.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {qrList.map((qr) => (
                <div key={qr._id} className="bg-white rounded-xl p-6 shadow-sm flex items-center gap-6">
                  {/* QR 이미지 */}
                  <div className="flex-shrink-0">
                    {qrImages[qr._id] && (
                      <img src={qrImages[qr._id]} alt="QR" className="w-24 h-24 rounded-lg border" />
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">{qr.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        qr.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {qr.isActive ? '활성' : '비활성'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                        {qr.type === 'url' ? 'URL' : qr.type === 'vcard' ? '명함' : '랜딩페이지'}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-500 mb-1">
                      코드: <code className="bg-gray-100 px-2 py-0.5 rounded">{qr.code}</code>
                    </p>
                    
                    {qr.type === 'url' && qr.targetUrl && (
                      <p className="text-sm text-gray-500 truncate max-w-md">
                        → {qr.targetUrl}
                      </p>
                    )}
                    {qr.type === 'vcard' && qr.vcardData?.name && (
                      <p className="text-sm text-gray-500">
                        명함: {qr.vcardData.name} {qr.vcardData.organization && `(${qr.vcardData.organization})`}
                      </p>
                    )}
                    {qr.type === 'landing' && qr.landingSlug && (
                      <p className="text-sm text-gray-500">
                        랜딩페이지: /l/{qr.landingSlug}
                      </p>
                    )}
                  </div>

                  {/* 통계 */}
                  <div className="text-center px-6 border-l">
                    <p className="text-3xl font-bold text-primary">{qr.scans}</p>
                    <p className="text-sm text-gray-500">스캔</p>
                  </div>

                  {/* 액션 */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadQR(qr)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="다운로드"
                    >
                      <i className="fas fa-download"></i>
                    </button>
                    <Link
                      href={`/admin/qr/${qr._id}`}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="통계"
                    >
                      <i className="fas fa-chart-bar"></i>
                    </Link>
                    <button
                      onClick={() => handleEdit(qr)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="수정"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(qr._id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      title="삭제"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 모달 */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-xl font-bold">
                  {editingQR ? 'QR 코드 수정' : '새 QR 코드'}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* 기본 정보 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    이름 (관리용)
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="예: 서울시당 당원가입"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    코드 (URL에 사용)
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">/qr/</span>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seoul-join"
                      required
                    />
                  </div>
                </div>

                {/* 타입 선택 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">타입</label>
                  <div className="flex gap-2">
                    {[
                      { value: 'url', label: 'URL 링크', icon: 'fas fa-link' },
                      { value: 'vcard', label: '명함 (vCard)', icon: 'fas fa-id-card' },
                      { value: 'landing', label: '랜딩페이지', icon: 'fas fa-mobile-alt' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, type: opt.value as typeof formData.type })}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-colors ${
                          formData.type === opt.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <i className={`${opt.icon} block text-xl mb-1`}></i>
                        <span className="text-sm">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* URL 타입 */}
                {formData.type === 'url' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이동할 URL
                    </label>
                    <input
                      type="url"
                      value={formData.targetUrl}
                      onChange={(e) => setFormData({ ...formData, targetUrl: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://www.forthefreedom.kr/participate/join"
                      required
                    />
                  </div>
                )}

                {/* 랜딩페이지 타입 */}
                {formData.type === 'landing' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      랜딩페이지 슬러그
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">/l/</span>
                      <input
                        type="text"
                        value={formData.landingSlug}
                        onChange={(e) => setFormData({ ...formData, landingSlug: e.target.value })}
                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="seoul-event-2024"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      <Link href="/admin/landing" className="text-primary hover:underline">
                        랜딩페이지 관리
                      </Link>에서 먼저 페이지를 만들어주세요.
                    </p>
                  </div>
                )}

                {/* vCard 타입 */}
                {formData.type === 'vcard' && (
                  <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-gray-700">명함 정보</h4>
                    <input
                      type="text"
                      placeholder="이름"
                      value={formData.vcardData.name}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, name: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                    <input
                      type="text"
                      placeholder="소속/회사"
                      value={formData.vcardData.organization}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, organization: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="직함"
                      value={formData.vcardData.title}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, title: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="전화번호"
                      value={formData.vcardData.phone}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, phone: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="이메일"
                      value={formData.vcardData.email}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, email: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="url"
                      placeholder="웹사이트"
                      value={formData.vcardData.website}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, website: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="주소"
                      value={formData.vcardData.address}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        vcardData: { ...formData.vcardData, address: e.target.value }
                      })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                )}

                {/* 활성화 */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isActive" className="text-sm text-gray-700">
                    활성화 (비활성화 시 스캔해도 리다이렉트 안 됨)
                  </label>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); resetForm(); }}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    {editingQR ? '수정' : '생성'}
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
