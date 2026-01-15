import type { Metadata } from 'next'
import PrinciplesTabs from '@/components/about/PrinciplesTabs'

export const metadata: Metadata = {
  title: '강령, 당헌, 당규, 정강 | 자유와혁신',
  description: '자유와혁신 강령, 당헌, 당규, 정강. 당의 기본 이념과 운영 원칙.',
  openGraph: {
    title: '강령, 당헌, 당규, 정강 | 자유와혁신',
    description: '자유와혁신 강령, 당헌, 당규, 정강',
    url: 'https://forthefreedom.kr/about/principles',
  },
}

export default function PrinciplesPage() {
  return (
    <div>
      <PrinciplesTabs />
    </div>
  )
}
