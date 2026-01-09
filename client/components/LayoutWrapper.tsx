'use client'

import { usePathname } from 'next/navigation'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SideBannerLeft from '@/components/SideBannerLeft'
import SideBannerRight from '@/components/SideBannerRight'
import TopNoticeBar from '@/components/TopNoticeBar'
import EntryPopup from '@/components/EntryPopup'
import LoginModal from '@/components/auth/LoginModal'
import Breadcrumb from '@/components/Breadcrumb'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')

  if (isAdmin) {
    // 관리자 페이지: 네비게이션, 푸터, 사이드배너 없음
    return <>{children}</>
  }

  // 일반 페이지: 전체 레이아웃
  return (
    <>
      <TopNoticeBar />
      <Navigation />
      <div style={{ paddingTop: 'calc(64px + var(--top-notice-h, 0px))' }}>
        <Breadcrumb />
      </div>
      <SideBannerLeft />
      <SideBannerRight />
      <main 
        className="min-h-screen"
      >
        {children}
      </main>
      <Footer />
      <EntryPopup />
      <LoginModal />
    </>
  )
}
