'use client'

import { useState, useEffect } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { useAuth } from '@/contexts/AuthContext'

interface EmailItem {
  label: string
  email: string
}

interface SocialItem {
  type: string
  url: string
  enabled: boolean
  order: number
}

interface LinkItem {
  label: string
  href: string
  enabled: boolean
  order: number
}

interface FooterLangData {
  slogan: string
  address: string
  addressSub: string
  phones: string[]
  fax: string
  emails: EmailItem[]
  socials: SocialItem[]
  quickLinks: LinkItem[]
  bottomLinks: LinkItem[]
}

interface FooterData {
  ko: FooterLangData
  en: FooterLangData
}

const defaultFooterData: FooterData = {
  ko: {
    slogan: '새로운 정치, 새로운 미래를 함께 만들어갑니다.',
    address: '서울 용산구 청파로45길 19, 복조빌딩 3층',
    addressSub: '(지번: 서울 용산구 청파동3가 29-14, 우편번호: 04307)',
    phones: ['02-2634-2023', '02-2634-2024'],
    fax: '02-2634-2026',
    emails: [{ label: '대표', email: 'info@freeinno.kr' }],
    socials: [
      { type: 'facebook', url: 'https://www.facebook.com/freeinnoparty', enabled: true, order: 1 },
      { type: 'x', url: 'https://x.com/freeinnoparty', enabled: true, order: 2 },
      { type: 'instagram', url: 'https://www.instagram.com/freeinnoparty', enabled: true, order: 3 },
      { type: 'youtube', url: 'https://youtube.com/@freeinnoparty', enabled: true, order: 4 },
    ],
    quickLinks: [
      { label: '당 소개', href: '/about', enabled: true, order: 1 },
      { label: '정책', href: '/about/policy', enabled: true, order: 2 },
      { label: '소식/활동', href: '/news', enabled: true, order: 3 },
      { label: '당원가입', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', enabled: true, order: 4 },
      { label: '후원', href: '/support', enabled: true, order: 5 },
      { label: '자료실', href: '/resources', enabled: true, order: 6 },
    ],
    bottomLinks: [
      { label: '개인정보처리방침', href: '/privacy', enabled: true, order: 1 },
      { label: '이용약관', href: '/terms', enabled: true, order: 2 },
      { label: '정보공개', href: '/disclosure', enabled: true, order: 3 },
    ],
  },
  en: {
    slogan: 'Building a new politics and a new future together.',
    address: '3F Bokjo Bldg, 19 Cheongpa-ro 45-gil, Yongsan-gu, Seoul',
    addressSub: '(Lot: 29-14 Cheongpa-dong 3-ga, Postal: 04307)',
    phones: ['02-2634-2023', '02-2634-2024'],
    fax: '02-2634-2026',
    emails: [{ label: 'General', email: 'info@freeinno.kr' }],
    socials: [
      { type: 'facebook', url: 'https://www.facebook.com/freeinnoparty', enabled: true, order: 1 },
      { type: 'x', url: 'https://x.com/freeinnoparty', enabled: true, order: 2 },
      { type: 'instagram', url: 'https://www.instagram.com/freeinnoparty', enabled: true, order: 3 },
      { type: 'youtube', url: 'https://youtube.com/@freeinnoparty', enabled: true, order: 4 },
    ],
    quickLinks: [
      { label: 'About Us', href: '/en/about', enabled: true, order: 1 },
      { label: 'Policy', href: '/en/about/policy', enabled: true, order: 2 },
      { label: 'News', href: '/en/news', enabled: true, order: 3 },
      { label: 'Join Party', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', enabled: true, order: 4 },
      { label: 'Support', href: '/en/support', enabled: true, order: 5 },
      { label: 'Resources', href: '/en/resources', enabled: true, order: 6 },
    ],
    bottomLinks: [
      { label: 'Privacy Policy', href: '/en/privacy', enabled: true, order: 1 },
      { label: 'Terms of Service', href: '/en/terms', enabled: true, order: 2 },
      { label: 'Disclosure', href: '/en/disclosure', enabled: true, order: 3 },
    ],
  },
}

const socialTypes = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'blog', label: '블로그' },
]

export default function FooterSettingsPage() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState<'ko' | 'en'>('ko')
  const [footerData, setFooterData] = useState<FooterData>(defaultFooterData)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // 데이터 로드 (API 연동 시)
  useEffect(() => {
    const loadFooterData = async () => {
      if (!token) return
      
      try {
        const response = await fetch('/api/admin/site-settings/footer', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const result = await response.json()
        
        if (result.success && result.data) {
          setFooterData(result.data)
        }
      } catch (error) {
        console.error('Footer settings load failed:', error)
        // 실패 시 기본값 유지
      }
    }
    
    loadFooterData()
  }, [token])

  const currentData = footerData[activeTab]

  const updateField = (field: keyof FooterLangData, value: any) => {
    setFooterData(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }))
  }

  // 전화번호 관리
  const addPhone = () => {
    updateField('phones', [...currentData.phones, ''])
  }
  const removePhone = (index: number) => {
    updateField('phones', currentData.phones.filter((_, i) => i !== index))
  }
  const updatePhone = (index: number, value: string) => {
    const newPhones = [...currentData.phones]
    newPhones[index] = value
    updateField('phones', newPhones)
  }

  // 이메일 관리
  const addEmail = () => {
    updateField('emails', [...currentData.emails, { label: '', email: '' }])
  }
  const removeEmail = (index: number) => {
    updateField('emails', currentData.emails.filter((_, i) => i !== index))
  }
  const updateEmail = (index: number, field: 'label' | 'email', value: string) => {
    const newEmails = [...currentData.emails]
    newEmails[index] = { ...newEmails[index], [field]: value }
    updateField('emails', newEmails)
  }

  // 소셜 링크 관리
  const addSocial = () => {
    const maxOrder = Math.max(...currentData.socials.map(s => s.order), 0)
    updateField('socials', [...currentData.socials, { type: 'facebook', url: '', enabled: true, order: maxOrder + 1 }])
  }
  const removeSocial = (index: number) => {
    updateField('socials', currentData.socials.filter((_, i) => i !== index))
  }
  const updateSocial = (index: number, field: keyof SocialItem, value: any) => {
    const newSocials = [...currentData.socials]
    newSocials[index] = { ...newSocials[index], [field]: value }
    updateField('socials', newSocials)
  }

  // 빠른 링크 관리
  const addQuickLink = () => {
    const maxOrder = Math.max(...currentData.quickLinks.map(l => l.order), 0)
    updateField('quickLinks', [...currentData.quickLinks, { label: '', href: '', enabled: true, order: maxOrder + 1 }])
  }
  const removeQuickLink = (index: number) => {
    updateField('quickLinks', currentData.quickLinks.filter((_, i) => i !== index))
  }
  const updateQuickLink = (index: number, field: keyof LinkItem, value: any) => {
    const newLinks = [...currentData.quickLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    updateField('quickLinks', newLinks)
  }

  // 하단 링크 관리
  const addBottomLink = () => {
    const maxOrder = Math.max(...currentData.bottomLinks.map(l => l.order), 0)
    updateField('bottomLinks', [...currentData.bottomLinks, { label: '', href: '', enabled: true, order: maxOrder + 1 }])
  }
  const removeBottomLink = (index: number) => {
    updateField('bottomLinks', currentData.bottomLinks.filter((_, i) => i !== index))
  }
  const updateBottomLink = (index: number, field: keyof LinkItem, value: any) => {
    const newLinks = [...currentData.bottomLinks]
    newLinks[index] = { ...newLinks[index], [field]: value }
    updateField('bottomLinks', newLinks)
  }

  // 저장
  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch('/api/admin/site-settings/footer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(footerData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        setMessage({ type: 'success', text: '저장되었습니다. 사이트에 즉시 반영됩니다.' })
      } else {
        setMessage({ type: 'error', text: result.message || '저장에 실패했습니다.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: '저장에 실패했습니다.' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            {/* 헤더 */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">푸터 설정</h1>
              <p className="text-gray-500 mt-1">사이트 하단에 표시되는 정보를 관리합니다</p>
            </div>

            {/* 언어 탭 */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTab('ko')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'ko'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                한국어
              </button>
              <button
                onClick={() => setActiveTab('en')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'en'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                English
              </button>
            </div>

            {/* 메시지 */}
            {message && (
              <div className={`mb-6 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message.text}
              </div>
            )}

            <div className="space-y-6">
              {/* 기본 정보 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">슬로건</label>
                    <input
                      type="text"
                      value={currentData.slogan}
                      onChange={(e) => updateField('slogan', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소</label>
                    <input
                      type="text"
                      value={currentData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">주소 보조 (지번/우편번호)</label>
                    <input
                      type="text"
                      value={currentData.addressSub}
                      onChange={(e) => updateField('addressSub', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">팩스</label>
                    <input
                      type="text"
                      value={currentData.fax}
                      onChange={(e) => updateField('fax', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      placeholder="02-0000-0000"
                    />
                  </div>
                </div>
              </section>

              {/* 전화번호 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">전화번호</h2>
                  <button
                    onClick={addPhone}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {currentData.phones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => updatePhone(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="02-0000-0000"
                      />
                      <button
                        onClick={() => removePhone(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 이메일 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">이메일</h2>
                  <button
                    onClick={addEmail}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {currentData.emails.map((email, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={email.label}
                        onChange={(e) => updateEmail(index, 'label', e.target.value)}
                        className="w-24 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="구분"
                      />
                      <input
                        type="email"
                        value={email.email}
                        onChange={(e) => updateEmail(index, 'email', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="email@example.com"
                      />
                      <button
                        onClick={() => removeEmail(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 소셜 링크 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">소셜 링크</h2>
                  <button
                    onClick={addSocial}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {currentData.socials.map((social, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <select
                        value={social.type}
                        onChange={(e) => updateSocial(index, 'type', e.target.value)}
                        className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                      >
                        {socialTypes.map(st => (
                          <option key={st.value} value={st.value}>{st.label}</option>
                        ))}
                      </select>
                      <input
                        type="url"
                        value={social.url}
                        onChange={(e) => updateSocial(index, 'url', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="https://"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={social.enabled}
                          onChange={(e) => updateSocial(index, 'enabled', e.target.checked)}
                          className="rounded"
                        />
                        표시
                      </label>
                      <button
                        onClick={() => removeSocial(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 빠른 링크 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">빠른 링크</h2>
                  <button
                    onClick={addQuickLink}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {currentData.quickLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                        className="w-32 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="표시명"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="/path 또는 https://"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateQuickLink(index, 'enabled', e.target.checked)}
                          className="rounded"
                        />
                        표시
                      </label>
                      <button
                        onClick={() => removeQuickLink(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 하단 링크 */}
              <section className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">하단 링크</h2>
                  <button
                    onClick={addBottomLink}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-lg hover:bg-primary/20"
                  >
                    + 추가
                  </button>
                </div>
                <div className="space-y-2">
                  {currentData.bottomLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateBottomLink(index, 'label', e.target.value)}
                        className="w-40 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="표시명"
                      />
                      <input
                        type="text"
                        value={link.href}
                        onChange={(e) => updateBottomLink(index, 'href', e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                        placeholder="/path"
                      />
                      <label className="flex items-center gap-1 text-sm">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => updateBottomLink(index, 'enabled', e.target.checked)}
                          className="rounded"
                        />
                        표시
                      </label>
                      <button
                        onClick={() => removeBottomLink(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        삭제
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              {/* 저장 버튼 */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {isSaving ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}
