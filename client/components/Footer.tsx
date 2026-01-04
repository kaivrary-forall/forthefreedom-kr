'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface FooterData {
  slogan: string
  address: string
  addressSub: string
  phones: string[]
  fax: string
  emails: { label: string; email: string }[]
  socials: { type: string; url: string; enabled: boolean; order: number }[]
  quickLinks: { label: string; href: string; enabled: boolean; order: number }[]
  bottomLinks: { label: string; href: string; enabled: boolean; order: number }[]
}

// 소셜 아이콘 컴포넌트
const SocialIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'facebook':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
    case 'x':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
    case 'instagram':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    case 'youtube':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
    case 'blog':
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zM8.25 8.25h7.5v1.5h-7.5v-1.5zm7.5 3.75h-7.5v1.5h7.5V12zm-3.75 3.75h-3.75v1.5H12v-1.5z"/></svg>
    default:
      return <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
  }
}

// 기본 데이터 (API 실패 시 fallback)
const defaultData: FooterData = {
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
    { type: 'youtube', url: 'https://youtube.com/@freeinnoparty', enabled: true, order: 4 }
  ],
  quickLinks: [
    { label: '당 소개', href: '/about', enabled: true, order: 1 },
    { label: '정책', href: '/about/policy', enabled: true, order: 2 },
    { label: '소식/활동', href: '/news', enabled: true, order: 3 },
    { label: '당원가입', href: 'https://www.ihappynanum.com/Nanum/api/screen/F7FCRIO2E3', enabled: true, order: 4 },
    { label: '후원', href: '/support', enabled: true, order: 5 },
    { label: '자료실', href: '/resources', enabled: true, order: 6 }
  ],
  bottomLinks: [
    { label: '개인정보처리방침', href: '/privacy', enabled: true, order: 1 },
    { label: '이용약관', href: '/terms', enabled: true, order: 2 },
    { label: '정보공개', href: '/disclosure', enabled: true, order: 3 }
  ]
}

export default function Footer() {
  const pathname = usePathname()
  const isEnPage = pathname?.startsWith('/en')
  const [footerData, setFooterData] = useState<FooterData>(defaultData)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const lang = isEnPage ? 'en' : 'ko'
        const response = await fetch(`/api/site-settings/footer?lang=${lang}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setFooterData(result.data)
        }
      } catch (error) {
        console.error('Footer data fetch failed:', error)
        // 실패 시 기본값 유지
      }
    }

    fetchFooterData()
  }, [isEnPage])

  const isExternalLink = (href: string) => href.startsWith('http')

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* 로고 및 소개 */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">
              {isEnPage ? 'Freedom & Innovation' : '자유와혁신'}
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              {footerData.slogan}
            </p>
            <div className="flex gap-4">
              {footerData.socials.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white" 
                  aria-label={social.type}
                >
                  <SocialIcon type={social.type} />
                </a>
              ))}
            </div>
          </div>

          {/* 연락처 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{isEnPage ? 'Contact' : '연락처'}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <div>
                  <span>{footerData.address}</span>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {footerData.addressSub}
                  </div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span>{footerData.phones.join(' / ')}</span>
              </li>
              {footerData.fax && (
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>
                  <span>FAX: {footerData.fax}</span>
                </li>
              )}
              {footerData.emails.map((email, index) => (
                <li key={index} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                  <a href={`mailto:${email.email}`} className="hover:text-white">{email.email}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h4 className="text-white font-semibold mb-4">{isEnPage ? 'Quick Links' : '빠른 링크'}</h4>
            <ul className="space-y-2 text-sm">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  {isExternalLink(link.href) ? (
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="hover:text-white">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 하단 저작권 및 링크 */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2025 {isEnPage ? 'Freedom & Innovation. All rights reserved.' : '자유와혁신. 모든 권리 보유.'}</p>
          <div className="flex gap-6">
            {footerData.bottomLinks.map((link, index) => (
              <Link key={index} href={link.href} className="hover:text-white">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
