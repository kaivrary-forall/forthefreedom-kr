'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface LandingPage {
  _id: string
  slug: string
  title: string
  blocks: unknown[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminLandingPage() {
  const { token } = useAuth()
  const [pages, setPages] = useState<LandingPage[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [newPageData, setNewPageData] = useState({ title: '', slug: '' })

  const fetchPages = useCallback(async () => {
    if (!token) return
    
    try {
      const res = await fetch('/api/admin/landing', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.pages) {
        setPages(data.pages)
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    fetchPages()
  }, [fetchPages])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    
    try {
      const res = await fetch('/api/admin/landing', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...newPageData,
          blocks: [],
          settings: { backgroundColor: '#ffffff' },
          isActive: false
        })
      })

      if (res.ok) {
        const data = await res.json()
        window.location.href = `/admin/landing/${data.page._id}`
      }
    } catch (error) {
      console.error('Failed to create page:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!token) return
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      await fetch(`/api/admin/landing/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchPages()
    } catch (error) {
      console.error('Failed to delete page:', error)
    }
  }

  const handleToggleActive = async (page: LandingPage) => {
    if (!token) return
    
    try {
      await fetch(`/api/admin/landing/${page._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !page.isActive })
      })
      fetchPages()
    } catch (error) {
      console.error('Failed to toggle active:', error)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      
      <main className="flex-1 p-8 ml-64">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">랜딩페이지 관리</h1>
              <p className="text-gray-500 mt-1">모바일 전용 랜딩페이지를 만들고 QR과 연결하세요.</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <i className="fas fa-plus"></i>
              새 페이지
            </button>
          </div>

          {loading ? (
            <div className="text-center py-12">로딩 중...</div>
          ) : pages.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center">
              <i className="fas fa-mobile-alt text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 mb-4">등록된 랜딩페이지가 없습니다.</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-primary hover:underline"
              >
                첫 번째 랜딩페이지 만들기
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pages.map((page) => (
                <div key={page._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-[9/16] bg-gray-100 relative max-h-48 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="fas fa-mobile-alt text-4xl text-gray-300"></i>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        page.isActive ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {page.isActive ? '공개' : '비공개'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-500 mb-3">/l/{page.slug}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {page.blocks?.length || 0}개 블록
                      </span>
                      
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleActive(page)}
                          className={`p-2 rounded-lg transition-colors ${
                            page.isActive 
                              ? 'text-green-600 hover:bg-green-50' 
                              : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={page.isActive ? '비공개로 전환' : '공개로 전환'}
                        >
                          <i className={`fas fa-${page.isActive ? 'eye' : 'eye-slash'}`}></i>
                        </button>
                        <a
                          href={`/l/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="미리보기"
                        >
                          <i className="fas fa-external-link-alt"></i>
                        </a>
                        <Link
                          href={`/admin/landing/${page._id}`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="편집"
                        >
                          <i className="fas fa-edit"></i>
                        </Link>
                        <button
                          onClick={() => handleDelete(page._id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="삭제"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl w-full max-w-md m-4">
              <div className="p-6 border-b">
                <h2 className="text-xl font-bold">새 랜딩페이지</h2>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    페이지 제목
                  </label>
                  <input
                    type="text"
                    value={newPageData.title}
                    onChange={(e) => setNewPageData({ ...newPageData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="서울시당 당원가입 이벤트"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL 슬러그
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm">/l/</span>
                    <input
                      type="text"
                      value={newPageData.slug}
                      onChange={(e) => setNewPageData({ 
                        ...newPageData, 
                        slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                      })}
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="seoul-event-2024"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    만들기
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
