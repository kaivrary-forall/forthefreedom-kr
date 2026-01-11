import type { Metadata } from 'next'
import MyPageContent from '@/components/mypage/MyPageContent'

export const metadata: Metadata = {
  title: '마이페이지 | 자유와혁신',
  robots: { index: false, follow: false },
}

export default function MyPage() {
  return <MyPageContent />
}
