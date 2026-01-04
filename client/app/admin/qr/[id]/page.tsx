'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import QRCode from 'qrcode'

interface QRDetail {
  _id: string
  code: string
  name: string
  type: 'url' | 'vcard' | 'landing'
  targetUrl?: string
  landingSlug?: string
  vcardData?: Record<string, string>
  scans: number
  isActive: boolean
  createdAt: string
}

interface Stats {
  total: number
  today: number
  thisWeek: number
  thisMonth: number
  byDate: Array<{ date: string; count: number }>
  byDevice: Array<{ device: string; count: number }>
  byCountry: Array<{ country: string; count: number }>
  recentScans: Array<{
    timestamp: string
    userAgent: string
    country?: string
    city?: string
  }>
}

export default function QRDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [qr, setQr] = useState<QRDetail | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [qrImage, setQrImage] = useState('')
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('30d')

  useEffect(() => {
    fetchData()
  }, [id, period])

  const fetchData = async () => {
    try {
      const [qrRes, statsRes] = await Promise.all([
        fetch(`/api/admin/qr/${id}`),
        fetch(`/api/admin/qr/${id}/stats?period=${period}`)
      ])

      const qrData = await qrRes.json()
      const statsData = await statsRes.json()

      if (qrData.qr) {
        setQr(qrData.qr)
        const url = `${window.location.origin}/qr/${qrData.qr.code}`
        const img = await QRCode.toDataURL(url, { width: 300, margin: 2 })
        setQrImage(img)
      }
      
      if (statsData.stats) {
        setStats(statsData.stats)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = async (size: number) => {
    if (!qr) return
    const url = `${window.location.origin}/qr/${qr.code}`
    const dataUrl = await QRCode.toDataURL(url, { width: size, margin: 2 })
    
    const link = document.createElement('a')
    link.download = `qr-${qr.code}-${size}px.png`
    link.href = dataUrl
    link.click()
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="text-center py-12">로딩 중...</div>
        </main>
      </div>
    )
  }

  if (!qr) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <main className="flex-1 p-8 ml-64">
          <div className="text-center py-12">QR 코드를 찾을 수 없습니다.</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center gap-4 mb-8">
            <Link 
              href="/admin/qr" 
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{qr.name}</h1>
              <p className="text-gray-500">/qr/{qr.code}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* 왼쪽: QR 코드 */}
            <div className="lg:col-span-1 space-y-6">
              {/* QR 이미지 */}
              <div className="bg-white rounded-xl p-6 text-center">
                {qrImage && (
                  <img src={qrImage} alt="QR" className="mx-auto rounded-lg border" />
                )}
                <p className="mt-4 text-sm text-gray-500 break-all">
                  {window.location.origin}/qr/{qr.code}
                </p>
                
                {/* 다운로드 버튼 */}
                <div className="mt-4 flex flex-wrap gap-2 justify-center">
                  {[200, 500, 1000].map((size) => (
                    <button
                      key={size}
                      onClick={() => downloadQR(size)}
                      className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      {size}px
                    </button>
                  ))}
                </div>
              </div>

              {/* QR 정보 */}
              <div className="bg-white rounded-xl p-6">
                <h3 className="font-bold mb-4">QR 정보</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">타입</span>
                    <span className="font-medium">
                      {qr.type === 'url' ? 'URL 링크' : qr.type === 'vcard' ? '명함' : '랜딩페이지'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">상태</span>
                    <span className={`font-medium ${qr.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                      {qr.isActive ? '활성' : '비활성'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">생성일</span>
                    <span>{new Date(qr.createdAt).toLocaleDateString('ko-KR')}</span>
                  </div>
                  {qr.targetUrl && (
                    <div className="pt-2 border-t">
                      <span className="text-gray-500 block mb-1">이동 URL</span>
                      <a href={qr.targetUrl} target="_blank" rel="noopener noreferrer" 
                         className="text-primary hover:underline break-all">
                        {qr.targetUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 오른쪽: 통계 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 기간 선택 */}
              <div className="flex gap-2">
                {[
                  { value: '7d', label: '7일' },
                  { value: '30d', label: '30일' },
                  { value: '90d', label: '90일' },
                  { value: 'all', label: '전체' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setPeriod(opt.value)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      period === opt.value
                        ? 'bg-primary text-white'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* 요약 카드 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: '총 스캔', value: stats?.total || 0 },
                  { label: '오늘', value: stats?.today || 0 },
                  { label: '이번 주', value: stats?.thisWeek || 0 },
                  { label: '이번 달', value: stats?.thisMonth || 0 },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-primary">{item.value}</p>
                    <p className="text-sm text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>

              {/* 일별 차트 (간단 바) */}
              {stats?.byDate && stats.byDate.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-bold mb-4">일별 스캔</h3>
                  <div className="flex items-end gap-1 h-32">
                    {stats.byDate.slice(-14).map((item, idx) => {
                      const max = Math.max(...stats.byDate.map(d => d.count))
                      const height = max > 0 ? (item.count / max) * 100 : 0
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-primary/80 rounded-t transition-all hover:bg-primary"
                            style={{ height: `${height}%`, minHeight: item.count > 0 ? '4px' : '0' }}
                            title={`${item.date}: ${item.count}회`}
                          ></div>
                          <span className="text-xs text-gray-400 mt-1">
                            {new Date(item.date).getDate()}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* 기기/국가 통계 */}
              <div className="grid md:grid-cols-2 gap-6">
                {stats?.byDevice && stats.byDevice.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-bold mb-4">기기별</h3>
                    <div className="space-y-2">
                      {stats.byDevice.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-gray-600">{item.device}</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stats?.byCountry && stats.byCountry.length > 0 && (
                  <div className="bg-white rounded-xl p-6">
                    <h3 className="font-bold mb-4">국가별</h3>
                    <div className="space-y-2">
                      {stats.byCountry.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <span className="text-gray-600">{item.country}</span>
                          <span className="font-medium">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 최근 스캔 */}
              {stats?.recentScans && stats.recentScans.length > 0 && (
                <div className="bg-white rounded-xl p-6">
                  <h3 className="font-bold mb-4">최근 스캔</h3>
                  <div className="space-y-3">
                    {stats.recentScans.slice(0, 10).map((scan, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500 w-32">
                          {new Date(scan.timestamp).toLocaleString('ko-KR')}
                        </span>
                        <span className="text-gray-600 flex-1 truncate">
                          {scan.userAgent?.includes('Mobile') ? '📱' : '💻'} {scan.city || scan.country || '알 수 없음'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
