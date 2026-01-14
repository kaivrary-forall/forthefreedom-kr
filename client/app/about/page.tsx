import type { Metadata } from 'next'
import AboutTabs from '@/components/about/AboutTabs'

export const metadata: Metadata = {
  title: '황교안 대표 소개 | 자유와혁신 당소개',
  description: '황교안 자유와혁신 대표 소개 및 당 소개. 창당 배경, 정체성, 미래 비전을 확인하세요.',
  openGraph: {
    title: '황교안 대표 소개 | 자유와혁신 당소개',
    description: '황교안 자유와혁신 대표 소개 및 당 소개. 창당 배경과 정체성, 미래 비전을 확인하세요',
    url: 'https://forthefreedom.kr/about',
    images: ['/images/profile-pic.jpg'],
  },
}

export default function AboutPage() {
  return <AboutTabs />
}
